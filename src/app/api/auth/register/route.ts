import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database/connection';
import { hashPassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';
import { userRegistrationSchema } from '@/lib/validations/schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Only allow normal user registration - force role to 'user'
    const userData = {
      name: body.name,
      email: body.email,
      password: body.password,
      address: body.address,
      role: 'user' // Always set to 'user' for public registration
    };

    const validatedData = userRegistrationSchema.parse(userData);
    const { name, email, password, address, role } = validatedData;

    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const result = await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, address, role',
      [name, email, hashedPassword, address, role]
    );

    const user = result.rows[0];
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    return NextResponse.json({
      message: 'User registered successfully',
      user: { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role },
      token
    }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}