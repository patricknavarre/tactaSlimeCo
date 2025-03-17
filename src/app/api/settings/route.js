import { NextResponse } from 'next/server';
import clientPromise, { connectToDatabase } from '@/lib/mongodb';
import { settingsSchema, createDefaultSettings } from '@/models/schemas';

// GET handler - Fetch settings
export async function GET(request) {
  try {
    // Use the connectToDatabase function which handles potential issues
    const { client, db } = await connectToDatabase();
    
    // Handle the case where db is null
    if (!db) {
      console.error("Database connection failed");
      return NextResponse.json(
        { error: "Failed to connect to database. Please check your MongoDB configuration." },
        { status: 500 }
      );
    }
    
    const settings = await db.collection('settings').findOne({});
    
    // If no settings exist, create default settings
    if (!settings) {
      const defaultSettings = createDefaultSettings();
      await db.collection('settings').insertOne(defaultSettings);
      return NextResponse.json(defaultSettings);
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings', details: error.message },
      { status: 500 }
    );
  }
}

// POST handler - Update settings
export async function POST(request) {
  try {
    // Use the connectToDatabase function which handles potential issues
    const { client, db } = await connectToDatabase();
    
    // Handle the case where db is null
    if (!db) {
      console.error("Database connection failed");
      return NextResponse.json(
        { error: "Failed to connect to database. Please check your MongoDB configuration." },
        { status: 500 }
      );
    }
    
    const data = await request.json();
    
    // Validate settings data
    // TODO: Add validation logic here
    
    // Check if settings already exist
    const existingSettings = await db.collection('settings').findOne({});
    
    if (existingSettings) {
      // Update existing settings
      const updateResult = await db.collection('settings').updateOne(
        { _id: existingSettings._id },
        { $set: { ...data, updatedAt: new Date() } }
      );
      
      if (updateResult.modifiedCount === 1) {
        const updatedSettings = await db.collection('settings').findOne({ _id: existingSettings._id });
        return NextResponse.json({
          message: 'Settings updated successfully',
          settings: updatedSettings
        });
      } else {
        return NextResponse.json(
          { error: 'Failed to update settings' },
          { status: 500 }
        );
      }
    } else {
      // Create new settings
      const newSettings = {
        ...createDefaultSettings(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const insertResult = await db.collection('settings').insertOne(newSettings);
      
      if (insertResult.acknowledged) {
        return NextResponse.json({
          message: 'Settings created successfully',
          settings: newSettings
        });
      } else {
        return NextResponse.json(
          { error: 'Failed to create settings' },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings', details: error.message },
      { status: 500 }
    );
  }
} 