import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database/connection';
import { verifyToken } from '@/lib/auth/jwt';
import { adminUserCreationSchema } from '@/lib/validations/schemas';
import { hashPassword } from '@/lib/auth/password';

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
    const role = searchParams.get('role') || '';
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    let sqlQuery = `
      SELECT id, name, email, address, role, created_at, updated_at
      FROM users
      WHERE 1=1
    `;
    
    const queryParams: any[] = [];
    let paramCount = 0;

    if (search && field) {
      sqlQuery += ` AND ${field} ILIKE $${++paramCount}`;
      queryParams.push(`%${search}%`);
    }

    if (role) {
      sqlQuery += ` AND role = $${++paramCount}`;
      queryParams.push(role);
    }

    // Add sorting
    const validSortFields = ['name', 'email', 'address', 'role', 'created_at'];
    const validSortOrder = ['asc', 'desc'];
    
    if (validSortFields.includes(sortBy) && validSortOrder.includes(sortOrder)) {
      sqlQuery += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
    }

    const result = await pool.query(sqlQuery, queryParams);

    return NextResponse.json({
      users: result.rows
    });
  } catch (error) {
    console.error('Get users error:', error);
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
    const validatedData = adminUserCreationSchema.parse(body);
    const { name, email, password, address, role } = validatedData;

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, address, role, created_at',
      [name, email, hashedPassword, address, role]
    );

    return NextResponse.json({
      message: 'User created successfully',
      user: result.rows[0]
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
    }
    console.error('Create user error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}