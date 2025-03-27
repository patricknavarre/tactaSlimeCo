import { NextResponse } from 'next/server';

export async function GET() {
  // Check environment variables without exposing their values
  const envStatus = {
    auth: {
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
      ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
      NEXT_PUBLIC_ADMIN_EMAIL: !!process.env.NEXT_PUBLIC_ADMIN_EMAIL,
      NEXT_PUBLIC_ADMIN_PASSWORD: !!process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
    },
    database: {
      MONGODB_URI: !!process.env.MONGODB_URI,
      MONGODB_DB: !!process.env.MONGODB_DB,
    },
    storage: {
      BLOB_READ_WRITE_TOKEN: !!process.env.BLOB_READ_WRITE_TOKEN,
    },
    config: {
      NODE_ENV: process.env.NODE_ENV,
      DEBUG: !!process.env.DEBUG,
      NEXT_PUBLIC_BACKEND_URL: !!process.env.NEXT_PUBLIC_BACKEND_URL,
    }
  };

  // Check if any critical variables are missing
  const missingVars = [];
  Object.entries(envStatus).forEach(([category, vars]) => {
    Object.entries(vars).forEach(([key, value]) => {
      if (!value && key !== 'DEBUG') { // DEBUG is optional
        missingVars.push(key);
      }
    });
  });

  return NextResponse.json({
    status: missingVars.length === 0 ? 'ok' : 'missing_vars',
    environment: process.env.NODE_ENV,
    missingVariables: missingVars,
    envStatus
  });
} 