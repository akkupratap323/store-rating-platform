import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database/connection';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json({ message: 'Authorization header required' }, { status: 401 });
    }

    const token = authorization.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const query = `
      SELECT 
        r.id,
        r.rating,
        r.created_at,
        u.name as user_name,
        u.email as user_email,
        s.name as store_name
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      JOIN stores s ON r.store_id = s.id
      ORDER BY r.created_at DESC
    `;

    const result = await pool.query(query);

    return NextResponse.json({
      ratings: result.rows
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}