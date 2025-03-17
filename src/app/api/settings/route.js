import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

// GET handler - Fetch settings
export async function GET() {
  console.log('API: GET /api/settings called');
  
  try {
    // Connect to the database
    const { db, error, fallbackData } = await connectToDatabase();
    
    // Check if we have a connection
    if (!db) {
      console.error('API: Database connection failed in /api/settings:', error?.message || 'Unknown reason');
      
      // If we have fallback data, return it
      if (fallbackData && fallbackData.settings) {
        console.log('API: Returning fallback settings data');
        return NextResponse.json(fallbackData.settings);
      }
      
      return NextResponse.json(
        { error: 'Database connection failed', details: error?.message || 'Unknown error' },
        { status: 500 }
      );
    }
    
    // Get theme settings from the database
    const settings = await db.collection('settings').findOne({ type: 'theme' }) || { 
      primaryColor: '#ff407d', 
      secondaryColor: '#6c48c9',
      type: 'theme'
    };
    
    console.log('API: Successfully fetched theme settings');
    
    // Return the settings as JSON
    return NextResponse.json(settings);
  } catch (error) {
    console.error('API: Error in /api/settings:', error.message);
    // Ensure we return a proper JSON response even in error cases
    return NextResponse.json(
      { error: 'Failed to fetch settings', details: error.message },
      { status: 500 }
    );
  }
}

// POST handler - Update settings
export async function POST(request) {
  console.log('API: POST /api/settings called');
  
  try {
    const { db, error } = await connectToDatabase();
    
    if (!db) {
      console.error('API: Database connection failed in POST /api/settings:', error?.message || 'Unknown reason');
      return NextResponse.json(
        { error: 'Database connection failed', details: error?.message || 'Unknown error' },
        { status: 500 }
      );
    }
    
    const body = await request.json();
    console.log('API: Settings data received:', body);
    
    // Ensure we have a type field
    if (!body.type) {
      body.type = 'theme';
    }
    
    // Update the settings with upsert
    const result = await db.collection('settings').updateOne(
      { type: body.type },
      { $set: body },
      { upsert: true }
    );
    
    console.log('API: Settings updated');
    
    return NextResponse.json({ 
      success: true, 
      modifiedCount: result.modifiedCount,
      upsertedId: result.upsertedId
    });
  } catch (error) {
    console.error('API: Error in POST /api/settings:', error.message);
    return NextResponse.json(
      { error: 'Failed to update settings', details: error.message },
      { status: 500 }
    );
  }
} 