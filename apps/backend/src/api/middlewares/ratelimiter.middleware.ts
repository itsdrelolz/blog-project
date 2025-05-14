import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    handler: (req: Request, res: Response, next: NextFunction) => {
        return res.status(429).json({ 
            error: 'Too many login attempts, please try again later.' 
        });
    }
});

export { loginLimiter };


