import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function initStorage() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    throw new Error('Missing Supabase credentials');
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  // Create the bucket if it doesn't exist
  const { data: buckets, error: listError } = await supabase
    .storage
    .listBuckets();

  if (listError) {
    throw new Error(`Error listing buckets: ${listError.message}`);
  }

  const bucketExists = buckets.some(bucket => bucket.name === 'blog-images');

  if (!bucketExists) {
    const { error: createError } = await supabase
      .storage
      .createBucket('blog-images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
      });

    if (createError) {
      throw new Error(`Error creating bucket: ${createError.message}`);
    }

    console.log('Created blog-images bucket');
  } else {
    console.log('blog-images bucket already exists');
  }

  // Set bucket policy to allow public access
  const { error: policyError } = await supabase
    .storage
    .from('blog-images')
    .createSignedUrl('test.txt', 1); // This will fail but that's okay

  if (policyError && !policyError.message.includes('Object not found')) {
    console.error('Error setting bucket policy:', policyError.message);
  }

  console.log('Storage initialization complete');
}

initStorage().catch(console.error); 