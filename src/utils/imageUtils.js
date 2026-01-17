import { uploadCoverImage } from "@/services/yotoService";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Upload card icon (16x16) if available
 * @param {string} accessToken - Yoto API access token
 * @returns {Promise<string|null>} Media ID of uploaded icon (for yoto:#mediaId format), or null if no icon found
 */
export async function uploadCardIcon(accessToken) {
  try {
    // Try to find an icon in the card-images directory
    const publicDir = join(process.cwd(), 'public', 'assets', 'card-images');
    const possibleIcons = ['countdown-to-f1-icon.png', 'f1-icon.png'];
    
    for (const iconName of possibleIcons) {
      try {
        const iconPath = join(publicDir, iconName);
        const iconBuffer = readFileSync(iconPath);
        
        console.log(`Found icon: ${iconName}, uploading to Yoto...`);
        
        // Upload icon to Yoto with autoConvert to resize to 16x16
        const url = new URL('https://api.yotoplay.com/media/displayIcons/user/me/upload');
        url.searchParams.set('autoConvert', 'true');
        url.searchParams.set('filename', iconName.replace(/\.[^/.]+$/, '')); // Remove extension
        
        const response = await fetch(url.toString(), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'image/png',
          },
          body: iconBuffer,
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Icon upload failed: ${errorText}`);
        }
        
        const result = await response.json();
        const mediaId = result.displayIcon?.mediaId;
        
        if (!mediaId) {
          throw new Error('No mediaId in upload response');
        }
        
        console.log(`Icon uploaded successfully with mediaId: ${mediaId}`);
        return mediaId;
      } catch (err) {
        // File not found or upload failed, continue to next possibility
        console.log(`Could not process icon "${iconName}": ${err.message}`);
        continue;
      }
    }
    
    console.log('No icon found in public/assets/card-images/');
    return null;
  } catch (error) {
    console.error('Error uploading icon:', error);
    // Don't fail the entire request if icon upload fails
    return null;
  }
}

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
