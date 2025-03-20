import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { connectToDatabase } from '@/lib/mongodb';

// GET handler to fetch website content
export async function GET() {
  console.log('GET /api/content: Starting request');
  try {
    const { db, error } = await connectToDatabase();
    
    if (!db) {
      console.error('GET /api/content: Database connection failed:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Database connection failed' 
      }, { status: 500 });
    }

    console.log('GET /api/content: Connected to database, fetching content');
    const content = await db.collection('websiteContent').findOne({});
    
    if (!content) {
      console.log('GET /api/content: No content found, returning default content');
      // Return default content if none exists
      const defaultContent = {
        home: {
          heroTitle: 'Discover the Magic of Tacta Slime',
          heroSubtitle: 'Handcrafted with love, designed to bring joy',
          heroButtonText: 'Shop Now',
          heroImagePath: '',
          featuredTitle: 'Our Popular Collections',
          featuredSubtitle: 'Explore our most loved slimes',
        },
        about: {
          heading: 'About Tacta Slime',
          story: 'Founded in 2020, Tacta Slime started as a passion project and quickly grew into a beloved brand...',
          missionTitle: 'Our Mission',
          missionText: 'To create the highest quality slime products that bring joy and sensory satisfaction to people of all ages.',
        }
      };
      
      // Insert default content
      await db.collection('websiteContent').insertOne(defaultContent);
      return NextResponse.json({ success: true, content: defaultContent });
    }

    console.log('GET /api/content: Content found, returning');
    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error('GET /api/content: Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch website content',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// POST handler to update website content
export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const formData = await request.formData();
    
    // Handle hero image upload if present
    const heroImage = formData.get('heroImage');
    let heroImagePath = null;
    
    if (heroImage) {
      const buffer = Buffer.from(await heroImage.arrayBuffer());
      const filename = heroImage.name.replace(/\s+/g, '-').toLowerCase();
      const uniqueFilename = `${Date.now()}-${filename}`;
      
      // Ensure the uploads directory exists
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'hero');
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) {
        if (err.code !== 'EEXIST') {
          throw err;
        }
      }
      
      const filePath = path.join(uploadDir, uniqueFilename);
      await writeFile(filePath, buffer);
      heroImagePath = `/images/hero/${uniqueFilename}`;
    }
    
    // Create content object
    const content = {
      home: {
        heroTitle: formData.get('heroTitle'),
        heroSubtitle: formData.get('heroSubtitle'),
        heroButtonText: formData.get('heroButtonText'),
        heroImagePath: heroImagePath || formData.get('currentHeroImagePath'),
        featuredTitle: formData.get('featuredTitle'),
        featuredSubtitle: formData.get('featuredSubtitle'),
      },
      about: {
        heading: formData.get('aboutHeading'),
        story: formData.get('aboutStory'),
        missionTitle: formData.get('missionTitle'),
        missionText: formData.get('missionText'),
      },
      updatedAt: new Date()
    };
    
    // Update or insert content
    const result = await db.collection('websiteContent').updateOne(
      {},
      { $set: content },
      { upsert: true }
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'Website content updated successfully',
      content 
    });
  } catch (error) {
    console.error('Error updating website content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update website content' },
      { status: 500 }
    );
  }
} 