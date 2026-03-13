import { db } from './server/db.ts';
import { storeItems } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const clothingImages = [
  '/clothing-1.png',
  '/clothing-2.png',
  '/clothing-3.png',
  '/clothing-4.png',
  '/clothing-5.png',
  '/clothing-6.png',
  '/clothing-7.png',
  '/clothing-8.png',
  '/clothing-9.png',
  '/clothing-10.png',
  '/clothing-11.png',
];

async function updateThumbnails() {
  try {
    // Get all clothing items
    const clothingItems = await db.query.storeItems.findMany({
      where: eq(storeItems.category, 'clothing'),
    });

    console.log(`Found ${clothingItems.length} clothing items`);

    // Update each item with a thumbnail
    for (let i = 0; i < clothingItems.length; i++) {
      const item = clothingItems[i];
      const imageUrl = clothingImages[i % clothingImages.length];
      
      await db.update(storeItems)
        .set({ thumbnailUrl: imageUrl })
        .where(eq(storeItems.id, item.id));
      
      console.log(`Updated ${item.name} with ${imageUrl}`);
    }

    console.log('All clothing items updated successfully!');
  } catch (error) {
    console.error('Error updating thumbnails:', error);
  }
}

updateThumbnails();
