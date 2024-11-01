import type { Request, Response, NextFunction } from "express"; 
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();


declare global { 
    namespace Express { 
        interface Request { 
            user? : {
                userId: number; 
                role: string; 
            }
        }
    }
}

// checks if token exist in request header 

// Actual token starts with 'Bearer' so we can make it into an array by splitting in 
// Then get the 2nd value(1st index) and check if it exist




const prisma = new PrismaClient();

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'your-secret-key'
};

passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: { id: jwt_payload.userId }
            });

            if (user) {
                return done(null, user);
            }
            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
    })
);




export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', {session: false }, (err, user, info) => {
        if (err) {
            console.error(`Authentication error: ${err}`);
        }
        if (!user) { 
            return res.status(401).json({
                error: info?.message || 'No tekn provided or invalid token'
            });
        }
    
        

        req.user = user; 
        next() 
    
    })(req, res, next);
}


// checks if user has the correct role 
export const checkCreatorRole = (req: Request, res: Response, next: NextFunction) => { 
    if (req.user?.role !== 'CREATOR' && req.user?.role !== 'ADMIN') {
        return res.status(403).json({
            error: 'Access denied. Creator or Admin role required.'
        })
    }
    next()
}






