import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    serverType: 'backend',
    port: 5051,
    serverTime: new Date().toISOString(),
    version: '1.0.0',
  });
} 