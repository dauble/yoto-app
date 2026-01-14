import { uploadCoverImage } from "@/services/yotoService";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Upload card cover image if available
 * @param {string} accessToken - Yoto API access token
 * @returns {Promise<string|null>} Media URL of uploaded image, or null if no image found
 */
export async function uploadCardCoverImage(accessToken) {
  try {
    // Try to find a cover image in the card-images directory
    const publicDir = join(process.cwd(), 'public', 'assets', 'card-images');
    const possibleImages = ['countdown-to-f1-card.png'];
    
    for (const imageName of possibleImages) {
      try {
        const imagePath = join(publicDir, imageName);
        const imageBuffer = readFileSync(imagePath);
        
        // Determine content type from file extension
        const ext = imageName.split('.').pop().toLowerCase();
        const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';
        
        console.log(`Found cover image: ${imageName}, uploading to Yoto...`);
        const mediaUrl = await uploadCoverImage(imageBuffer, accessToken, contentType);
        console.log(`Cover image uploaded successfully: ${mediaUrl}`);
        
        return mediaUrl;
      } catch (err) {
        // File not found, continue to next possibility
        console.error(`Error processing cover image "${imageName}":`, err);
        continue;
      }
    }
    
    console.log('No cover image found in public/assets/card-images/');
    return null;
  } catch (error) {
    console.error('Error uploading cover image:', error);
    // Don't fail the entire request if cover upload fails
    return null;
  }
}
