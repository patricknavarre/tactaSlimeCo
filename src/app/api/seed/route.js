import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request) {
  try {
    // Only allow in development or with admin authorization
    if (process.env.NODE_ENV === 'production') {
      const authHeader = request.headers.get('authorization');
      if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const { products } = await request.json();
    
    if (!Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected array of products' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Validate each product
    const validProducts = products.map(product => ({
      name: product.name,
      description: product.description,
      price: Number(product.price),
      inventory: Number(product.inventory),
      category: product.category,
      featured: Boolean(product.featured),
      imagePath: product.imagePath,
      images: product.images || [{
        url: product.imagePath,
        alt: product.name
      }],
      video: product.video,
      createdAt: new Date(product.createdAt),
      updatedAt: new Date()
    }));

    // Clear existing products
    await db.collection('products').deleteMany({});
    
    // Insert new products
    const result = await db.collection('products').insertMany(validProducts);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${result.insertedCount} products`
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed products' },
      { status: 500 }
    );
  }
} 