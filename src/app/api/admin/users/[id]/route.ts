import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database/connection';
import { verifyToken } from '@/lib/auth/jwt';
import { adminUserUpdateSchema } from '@/lib/validations/schemas';
import { hashPassword } from '@/lib/auth/password';
import { isZodError } from '@/types/api';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.id);
    if (isNaN(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (existingUser.rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = adminUserUpdateSchema.parse(body);
    const { name, email, address, role, password } = validatedData;

    // Check if email is taken by another user
    if (email && email !== existingUser.rows[0].email) {
      const emailCheck = await pool.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, userId]);
      if (emailCheck.rows.length > 0) {
        return NextResponse.json({ message: 'Email already taken by another user' }, { status: 400 });
      }
    }

    // Build update query dynamically
    const updateFields = [];
    const queryParams = [];
    let paramCount = 0;

    if (name !== undefined) {
      updateFields.push(`name = $${++paramCount}`);
      queryParams.push(name);
    }
    if (email !== undefined) {
      updateFields.push(`email = $${++paramCount}`);
      queryParams.push(email);
    }
    if (address !== undefined) {
      updateFields.push(`address = $${++paramCount}`);
      queryParams.push(address);
    }
    if (role !== undefined) {
      updateFields.push(`role = $${++paramCount}`);
      queryParams.push(role);
    }
    if (password !== undefined) {
      const hashedPassword = await hashPassword(password);
      updateFields.push(`password = $${++paramCount}`);
      queryParams.push(hashedPassword);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    }

    // Add user ID and updated_at
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    queryParams.push(userId);

    const updateQuery = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${++paramCount}
      RETURNING id, name, email, address, role, created_at, updated_at
    `;

    const result = await pool.query(updateQuery, queryParams);

    return NextResponse.json({
      message: 'User updated successfully',
      user: result.rows[0]
    });
  } catch (error: unknown) {
    if (isZodError(error)) {
      return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
    }
    console.error('Update user error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.id);
    if (isNaN(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (existingUser.rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Prevent deletion of current admin user
    if (user.id === userId) {
      return NextResponse.json({ message: 'Cannot delete your own account' }, { status: 400 });
    }

    // Check if user has associated stores (for store owners)
    const associatedStores = await pool.query('SELECT COUNT(*) as count FROM stores WHERE owner_id = $1', [userId]);
    if (parseInt(associatedStores.rows[0].count) > 0) {
      return NextResponse.json({ 
        message: 'Cannot delete user with associated stores. Please reassign or delete stores first.' 
      }, { status: 400 });
    }

    // Delete user (cascade will handle ratings)
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);

    return NextResponse.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}