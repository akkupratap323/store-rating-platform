import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database/connection';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'Access token required' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const field = searchParams.get('field') || 'name';

    let sqlQuery = `
      SELECT 
        s.id, s.name, s.email, s.address, s.created_at,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_ratings,
        ur.rating as user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = $1
    `;

    const queryParams: (string | number)[] = [user.id];
    let paramCount = 1;

    if (query && field) {
      sqlQuery += ` WHERE s.${field} ILIKE $${++paramCount}`;
      queryParams.push(`%${query}%`);
    }

    sqlQuery += ` GROUP BY s.id, s.name, s.email, s.address, s.created_at, ur.rating ORDER BY s.name`;

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