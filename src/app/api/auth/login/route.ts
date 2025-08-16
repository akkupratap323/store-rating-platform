import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database/connection';
import { comparePassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';
import { userLoginSchema } from '@/lib/validations/schemas';
import { isZodError } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = userLoginSchema.parse(body);
    const { email, password } = validatedData;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = result.rows[0];
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    return NextResponse.json({
      message: 'Login successful',
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        address: user.address, 
        role: user.role 
      },
      token
    });
  } catch (error: unknown) {
    if (isZodError(error)) {
      return NextResponse.json(
        { message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}