import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.get('/image', async (req, res) => {
  try {
    const imageUrl = req.query.url as string;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Forward the content type
    res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
    
    // Stream the image data
    response.body.pipe(res);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to proxy image request' });
  }
});

export default router; 