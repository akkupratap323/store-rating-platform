import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database/connection';
import { comparePassword, hashPassword } from '@/lib/auth/password';
import { verifyToken } from '@/lib/auth/jwt';
import { passwordUpdateSchema } from '@/lib/validations/schemas';
import { isZodError } from '@/types/api';

export async function PUT(request: NextRequest) {
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
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = passwordUpdateSchema.parse(body);
    const { currentPassword, newPassword } = validatedData;

    // Get current user
    const result = await pool.query('SELECT password FROM users WHERE id = $1', [user.id]);
    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const currentUser = result.rows[0];

    // Verify current password
    const isValidPassword = await comparePassword(currentPassword, currentUser.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedNewPassword, user.id]);

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error: unknown) {
    if (isZodError(error)) {
      return NextResponse.json(
        { message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }
    console.error('Password update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}