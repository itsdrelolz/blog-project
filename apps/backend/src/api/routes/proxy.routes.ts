import { Router, Request, Response, RequestHandler } from 'express';
import fetch from 'node-fetch';

const router = Router();

const proxyImageHandler: RequestHandler = async (req, res, next) => {
    try {
        const imageUrl = decodeURIComponent(req.params.url);
        
        // Validate the URL is from Supabase
        if (!imageUrl.includes('supabase.co')) {
            res.status(400).json({ error: 'Invalid image URL' });
            return;
        }

        const response = await fetch(imageUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        // Forward the content type
        res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
        
        // Stream the image data
        response.body?.pipe(res);
    } catch (error) {
        console.error('Error proxying image:', error);
        res.status(500).json({ error: 'Failed to proxy image' });
    }
};

router.get('/image/:url(*)', proxyImageHandler);

export default router; 