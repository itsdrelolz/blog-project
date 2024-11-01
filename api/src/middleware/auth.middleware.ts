import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserRole } from "../models/user.model";
import type { Request, Response, NextFunction } from "express";
dotenv.config();






// checks if a user is authenticated
interface TokenPayload {
  id: number;
  role: UserRole;
  email: string;
}



export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'No authorization token provided' });
      return;
    }

    // Check token format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status(401).json({ error: 'Token format invalid' });
      return;
    }

    const token = parts[1];

    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || ' '
    ) as TokenPayload;

    // Add user data to request
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }
    
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};








// checks if user has the correct role
export const checkCreatorRole = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required.',
      });
      return;
    }

    const allowedRoles = [UserRole.CREATOR, UserRole.ADMIN];
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Access denied. Creator or Admin role required.',
        currentRole: req.user.role,
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      error: 'Error checking user role',
    });
    return;
  }
};