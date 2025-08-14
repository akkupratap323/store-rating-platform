import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database/connection';
import { verifyToken } from '@/lib/auth/jwt';
import { ratingSchema } from '@/lib/validations/schemas';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'Access token required' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || user.role !== 'user') {
      return NextResponse.json({ message: 'Only users can submit ratings' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = ratingSchema.parse(body);
    const { storeId, rating } = validatedData;

    const storeExists = await pool.query('SELECT id FROM stores WHERE id = $1', [storeId]);
    if (storeExists.rows.length === 0) {
      return NextResponse.json({ message: 'Store not found' }, { status: 404 });
    }

    const existingRating = await pool.query(
      'SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2',
      [user.id, storeId]
    );

    let result;
    if (existingRating.rows.length > 0) {
      result = await pool.query(
        'UPDATE ratings SET rating = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND store_id = $3 RETURNING *',
        [rating, user.id, storeId]
      );
    } else {
      result = await pool.query(
        'INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3) RETURNING *',
        [user.id, storeId, rating]
      );
    }

    return NextResponse.json({
      message: existingRating.rows.length > 0 ? 'Rating updated successfully' : 'Rating submitted successfully',
      rating: result.rows[0]
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
    }
    console.error('Rating error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

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

    // Get user's ratings
    const result = await pool.query(`
      SELECT 
        r.id, r.rating, r.created_at, r.updated_at,
        s.id as store_id, s.name as store_name, s.address as store_address
      FROM ratings r
      JOIN stores s ON r.store_id = s.id
      WHERE r.user_id = $1
      ORDER BY r.updated_at DESC
    `, [user.id]);

    return NextResponse.json({
      ratings: result.rows
    });
  } catch (error) {
    console.error('Get ratings error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}