import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();
    
    // Get all products
    const products = await Product.find({});
    const updates = [];
    
    // Process each product
    for (const product of products) {
      let needsUpdate = false;
      const updateData = {};
      
      // Check for image fields in the product
      if (product.images && product.images.length > 0) {
        const mainImage = product.images[0];
        
        // If imagePath exists but not in images array
        if (product.imagePath && (!mainImage.url || mainImage.url !== product.imagePath)) {
          updateData.images = [{ url: product.imagePath, alt: product.name }, ...product.images.slice(1)];
          needsUpdate = true;
        }
        
        // If main image url exists but not in imagePath
        if (mainImage.url && (!product.imagePath || product.imagePath !== mainImage.url)) {
          updateData.imagePath = mainImage.url;
          needsUpdate = true;
        }
      } else if (product.imagePath) {
        // If only imagePath exists, create images array
        updateData.images = [{ url: product.imagePath, alt: product.name }];
        needsUpdate = true;
      }
      
      // If update is needed, perform it
      if (needsUpdate) {
        await Product.findByIdAndUpdate(product._id, updateData);
        updates.push({
          productId: product._id,
          name: product.name,
          oldImagePath: product.imagePath,
          oldImages: product.images,
          newImagePath: updateData.imagePath || product.imagePath,
          newImages: updateData.images || product.images
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Image sync completed',
      totalProducts: products.length,
      updatedProducts: updates.length,
      updates
    });
    
  } catch (error) {
    console.error('Error syncing images:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 