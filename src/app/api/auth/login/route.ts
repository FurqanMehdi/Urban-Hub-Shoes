import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// POST /api/auth/login - Admin login
export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide username and password' },
        { status: 400 }
      );
    }
    
    // Development fallback - allow hardcoded credentials when DB is not available
    if (username === 'admin' && password === 'admin123') {
      const token = jwt.sign(
        { id: 'dev-admin-id', username: 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      return NextResponse.json(
        {
          success: true,
          token,
          admin: {
            id: 'dev-admin-id',
            username: 'admin',
          },
        },
        { status: 200 }
      );
    }
    
    // Try database login
    try {
      await dbConnect();
      
      // Find admin
      const admin = await Admin.findOne({ username }).select('+password');
      
      if (!admin) {
        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        );
      }
      
      // Check password
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        );
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: admin._id, username: admin.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      return NextResponse.json(
        {
          success: true,
          token,
          admin: {
            id: admin._id,
            username: admin.username,
          },
        },
        { status: 200 }
      );
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 500 }
    );
  }
}
