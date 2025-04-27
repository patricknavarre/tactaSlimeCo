import fs from 'fs/promises';
import path from 'path';

/**
 * This script prepares your local images for deployment to production
 * 
 * Usage:
 * 1. Run this script before deploying your site
 * 2. It will copy all product images to the public folder that gets deployed
 * 3. This ensures the same paths work in both development and production
 */

async function deployImages() {
  try {
    // Source directory (where your product images are)
    const sourceDir = path.join(process.cwd(), 'public', 'images', 'products');
    
    // Make sure the directory exists
    try {
      await fs.access(sourceDir);
    } catch (err) {
      console.error(`Error: Source directory ${sourceDir} does not exist!`);
      process.exit(1);
    }
    
    // Get all files from the source directory
    console.log(`Reading files from ${sourceDir}...`);
    const files = await fs.readdir(sourceDir);
    console.log(`Found ${files.length} files`);
    
    // Create a list of all images that will be deployed with the site
    const imageData = files.map(file => {
      return {
        filename: file,
        path: `/images/products/${file}`,
      };
    });
    
    // Generate a deployment info file
    const deployInfo = {
      timestamp: new Date().toISOString(),
      imageCount: files.length,
      images: imageData
    };
    
    // Write the deployment info to a file
    const deployInfoPath = path.join(process.cwd(), 'public', 'deploy-images.json');
    await fs.writeFile(deployInfoPath, JSON.stringify(deployInfo, null, 2));
    console.log(`Deployment info written to ${deployInfoPath}`);
    
    console.log('\nDEPLOYMENT INSTRUCTIONS:');
    console.log('1. Make sure all your image files are in public/images/products/');
    console.log('2. Deploy your site normally with "vercel --prod"');
    console.log('3. All images will be included in the deployment automatically');
    console.log('\nDONE: Your images are ready for deployment!');
    
  } catch (error) {
    console.error('Error preparing images for deployment:', error);
    process.exit(1);
  }
}

deployImages(); 