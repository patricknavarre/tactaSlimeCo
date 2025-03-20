import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Default content
    const defaultContent = {
      home: {
        heroTitle: 'Discover the Magic of Tacta Slime',
        heroSubtitle: 'Handcrafted with love, designed to bring joy',
        heroButtonText: 'Shop Now',
        heroImagePath: '/images/hero/default-hero.jpg',
        featuredTitle: 'Our Popular Collections',
        featuredSubtitle: 'Explore our most loved slimes',
      },
      about: {
        heading: 'About Tacta Slime',
        story: 'Founded in 2020, Tacta Slime started as a passion project and quickly grew into a beloved brand...',
        missionTitle: 'Our Mission',
        missionText: 'To create the highest quality slime products that bring joy and sensory satisfaction to people of all ages.',
      },
      updatedAt: new Date()
    };

    // Insert or update the content
    const result = await db.collection('websiteContent').updateOne(
      {},
      { $set: defaultContent },
      { upsert: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Website content seeded successfully',
      result 
    });
  } catch (error) {
    console.error('Error seeding website content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed website content' },
      { status: 500 }
    );
  }
} 