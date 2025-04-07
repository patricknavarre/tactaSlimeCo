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
        error: 'Database connection failed. Please check MongoDB configuration.',
        details: error?.message || 'No database connection available'
      }, { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
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
      
      try {
        // Insert default content
        await db.collection('websiteContent').insertOne(defaultContent);
      } catch (insertError) {
        console.error('Error inserting default content:', insertError);
      }
      
      return NextResponse.json({ 
        success: true, 
        content: defaultContent 
      }, { 
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    console.log('GET /api/content: Content found, returning');
    return NextResponse.json({ 
      success: true, 
      content 
    }, { 
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('GET /api/content: Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch website content',
        details: error.message 
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

// POST handler to update website content
export async function POST(request) {
  try {
    const { db, error } = await connectToDatabase();
    
    if (!db) {
      console.error('POST /api/content: Database connection failed:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Database connection failed. Please check MongoDB configuration.',
        details: error?.message || 'No database connection available'
      }, { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

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
        heroImagePath: heroImagePath || formData.get('heroImagePath') || '',
        featuredTitle: formData.get('featuredTitle'),
        featuredSubtitle: formData.get('featuredSubtitle'),
        video: {
          url: formData.get('homeVideoUrl') || '',
          type: formData.get('homeVideoType') || 'youtube',
          title: formData.get('homeVideoTitle') || ''
        }
      },
      menu: {
        title: formData.get('menuTitle') || 'Tacta Slime Menu',
        subtitle: formData.get('menuSubtitle') || 'Discover our handcrafted slimes available at today\'s market!'
      },
      about: {
        heading: formData.get('aboutHeading'),
        story: formData.get('aboutStory'),
        missionTitle: formData.get('missionTitle'),
        missionText: formData.get('missionText'),
        video: {
          url: formData.get('aboutVideoUrl') || '',
          type: formData.get('aboutVideoType') || 'youtube',
          title: formData.get('aboutVideoTitle') || ''
        }
      },
      updatedAt: new Date()
    };
    
    // Get existing content to preserve any fields not in the form
    const existingContent = await db.collection('websiteContent').findOne({});
    if (existingContent) {
      // Preserve existing hero image path if no new image is uploaded
      if (!heroImagePath && existingContent.home?.heroImagePath) {
        content.home.heroImagePath = existingContent.home.heroImagePath;
      }
      
      // Preserve existing video data if not provided in the form
      if (!formData.get('homeVideoUrl') && existingContent.home?.video) {
        content.home.video = existingContent.home.video;
      }
      if (!formData.get('aboutVideoUrl') && existingContent.about?.video) {
        content.about.video = existingContent.about.video;
      }
    }
    
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
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error updating website content:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update website content',
        details: error.message
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
} 