import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    
    // Get connection status
    const status = mongoose.connection.readyState;
    const statusMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    // Get database info
    const dbInfo = {
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      collections: Object.keys(mongoose.connection.collections).length,
      models: Object.keys(mongoose.models).join(', ')
    };
    
    return NextResponse.json({
      message: `Database is ${statusMap[status]}`,
      status: statusMap[status],
      info: dbInfo,
      success: status === 1
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        message: `Database connection error: ${error.message}`,
        status: 'error',
        success: false
      },
      { status: 500 }
    );
  }
}