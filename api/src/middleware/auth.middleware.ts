import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserRole } from "../models/user.model";
import type { Request, Response, NextFunction } from "express";
dotenv.config();









































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