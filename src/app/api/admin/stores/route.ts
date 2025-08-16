import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database/connection';
import { verifyToken } from '@/lib/auth/jwt';
import { storeCreationSchema } from '@/lib/validations/schemas';
import { isZodError } from '@/types/api';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'Access token required' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const field = searchParams.get('field') || 'name';
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    let sqlQuery = `
      SELECT 
        s.id, s.name, s.email, s.address, s.created_at,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_ratings,
        u.name as owner_name
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN users u ON s.owner_id = u.id
      WHERE 1=1
    `;
    
    const queryParams: string[] = [];
    let paramCount = 0;

    if (search && field) {
      sqlQuery += ` AND s.${field} ILIKE $${++paramCount}`;
      queryParams.push(`%${search}%`);
    }

    sqlQuery += ` GROUP BY s.id, s.name, s.email, s.address, s.created_at, u.name`;

    // Add sorting
    const validSortFields = ['name', 'email', 'address', 'average_rating', 'total_ratings', 'created_at'];
    const validSortOrder = ['asc', 'desc'];
    
    if (validSortFields.includes(sortBy) && validSortOrder.includes(sortOrder)) {
      if (sortBy === 'average_rating' || sortBy === 'total_ratings') {
        sqlQuery += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
      } else {
        sqlQuery += ` ORDER BY s.${sortBy} ${sortOrder.toUpperCase()}`;
      }
    }

    const result = await pool.query(sqlQuery, queryParams);

    return NextResponse.json({
      stores: result.rows.map(store => ({
        ...store,
        average_rating: parseFloat(store.average_rating).toFixed(1),
        total_ratings: parseInt(store.total_ratings)
      }))
    });
  } catch (error) {
    console.error('Get stores error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'Access token required' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = storeCreationSchema.parse(body);
    const { name, email, address, ownerEmail } = validatedData;

    // Check if store already exists
    const existingStore = await pool.query('SELECT id FROM stores WHERE email = $1', [email]);
    if (existingStore.rows.length > 0) {
      return NextResponse.json({ message: 'Store with this email already exists' }, { status: 400 });
    }

    let ownerId = null;
    if (ownerEmail) {
      // Find owner by email
      const ownerResult = await pool.query('SELECT id, role FROM users WHERE email = $1', [ownerEmail]);
      if (ownerResult.rows.length === 0) {
        return NextResponse.json({ message: 'Store owner not found' }, { status: 400 });
      }
      if (ownerResult.rows[0].role !== 'store_owner') {
        return NextResponse.json({ message: 'User must have store_owner role' }, { status: 400 });
      }
      ownerId = ownerResult.rows[0].id;
    }

    // Create store
    const result = await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING id, name, email, address, owner_id, created_at',
      [name, email, address, ownerId]
    );

    return NextResponse.json({
      message: 'Store created successfully',
      store: result.rows[0]
    });
  } catch (error: unknown) {
    if (isZodError(error)) {
      return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
    }
    console.error('Create store error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}