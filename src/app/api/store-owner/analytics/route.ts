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

    if (!decoded || decoded.role !== 'store_owner') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const userId = decoded.id;

    // Get stores owned by this user
    const storesQuery = `
      SELECT COUNT(*) as total_stores
      FROM stores 
      WHERE owner_id = $1
    `;
    const storesResult = await pool.query(storesQuery, [userId]);

    // Get total ratings for owned stores
    const ratingsQuery = `
      SELECT 
        COUNT(*) as total_ratings,
        AVG(r.rating)::numeric(3,2) as average_rating
      FROM ratings r
      JOIN stores s ON r.store_id = s.id
      WHERE s.owner_id = $1
    `;
    const ratingsResult = await pool.query(ratingsQuery, [userId]);

    // Get ratings from this month
    const thisMonthQuery = `
      SELECT COUNT(*) as ratings_this_month
      FROM ratings r
      JOIN stores s ON r.store_id = s.id
      WHERE s.owner_id = $1 
      AND r.created_at >= date_trunc('month', CURRENT_DATE)
    `;
    const thisMonthResult = await pool.query(thisMonthQuery, [userId]);

    // Get recent ratings
    const recentRatingsQuery = `
      SELECT 
        r.id,
        r.rating,
        r.created_at,
        u.name as user_name,
        s.name as store_name
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      JOIN stores s ON r.store_id = s.id
      WHERE s.owner_id = $1
      ORDER BY r.created_at DESC
      LIMIT 10
    `;
    const recentRatingsResult = await pool.query(recentRatingsQuery, [userId]);

    return NextResponse.json({
      total_stores: parseInt(storesResult.rows[0].total_stores),
      total_ratings: parseInt(ratingsResult.rows[0].total_ratings || 0),
      average_rating: parseFloat(ratingsResult.rows[0].average_rating || 0),
      ratings_this_month: parseInt(thisMonthResult.rows[0].ratings_this_month),
      recent_ratings: recentRatingsResult.rows
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}