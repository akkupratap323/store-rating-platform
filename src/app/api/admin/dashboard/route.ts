import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database/connection';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { message: 'Access token required' },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get total users
    const usersResult = await pool.query('SELECT COUNT(*) as total FROM users');
    const totalUsers = parseInt(usersResult.rows[0].total);

    // Get total stores
    const storesResult = await pool.query('SELECT COUNT(*) as total FROM stores');
    const totalStores = parseInt(storesResult.rows[0].total);

    // Get total ratings
    const ratingsResult = await pool.query('SELECT COUNT(*) as total FROM ratings');
    const totalRatings = parseInt(ratingsResult.rows[0].total);

    // Get users by role
    const roleStatsResult = await pool.query(`
      SELECT role, COUNT(*) as count 
      FROM users 
      GROUP BY role 
      ORDER BY role
    `);

    // Get average rating across all stores
    const avgRatingResult = await pool.query(`
      SELECT COALESCE(AVG(rating), 0) as average_rating 
      FROM ratings
    `);

    // Get recent registrations (last 30 days)
    const recentUsersResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE created_at >= NOW() - INTERVAL '30 days'
    `);

    // Get recent ratings (last 30 days)
    const recentRatingsResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM ratings 
      WHERE created_at >= NOW() - INTERVAL '30 days'
    `);

    return NextResponse.json({
      totalUsers,
      totalStores,
      totalRatings,
      averageRating: parseFloat(avgRatingResult.rows[0].average_rating).toFixed(1),
      recentUsers: parseInt(recentUsersResult.rows[0].count),
      recentRatings: parseInt(recentRatingsResult.rows[0].count),
      usersByRole: roleStatsResult.rows.reduce((acc, row) => {
        acc[row.role] = parseInt(row.count);
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}