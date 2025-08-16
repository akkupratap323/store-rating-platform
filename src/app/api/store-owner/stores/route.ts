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
    if (!user || user.role !== 'store_owner') {
      return NextResponse.json({ message: 'Store owner access required' }, { status: 403 });
    }

    // Get stores owned by this user with ratings
    const storesResult = await pool.query(`
      SELECT 
        s.id, s.name, s.email, s.address, s.created_at,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.owner_id = $1
      GROUP BY s.id, s.name, s.email, s.address, s.created_at
      ORDER BY s.name
    `, [user.id]);

    // Get users who rated stores owned by this user
    const ratingsResult = await pool.query(`
      SELECT 
        r.id, r.rating, r.created_at,
        u.name as user_name, u.email as user_email,
        s.name as store_name, s.id as store_id
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      JOIN stores s ON r.store_id = s.id
      WHERE s.owner_id = $1
      ORDER BY r.created_at DESC
    `, [user.id]);

    // Calculate overall statistics
    const totalStores = storesResult.rows.length;
    const totalRatings = ratingsResult.rows.length;
    const overallAverageRating = totalRatings > 0 
      ? (storesResult.rows.reduce((sum, store) => sum + parseFloat(store.average_rating), 0) / totalStores).toFixed(1)
      : '0.0';

    return NextResponse.json({
      stores: storesResult.rows.map(store => ({
        ...store,
        average_rating: parseFloat(store.average_rating).toFixed(1),
        total_ratings: parseInt(store.total_ratings)
      })),
      ratings: ratingsResult.rows,
      statistics: {
        totalStores,
        totalRatings,
        overallAverageRating
      }
    });
  } catch (error) {
    console.error('Get store owner data error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}