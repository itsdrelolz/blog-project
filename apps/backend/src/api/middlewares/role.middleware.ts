import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from '@blog-project/shared-types/types/auth';
import prisma from '../../lib/prisma';

export const requireRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as TokenPayload;
      
      if (!user || !user.id) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const userWithRole = await prisma.user.findUnique({
        where: { id: user.id },
        include: { role: true }
      });

      if (!userWithRole || !userWithRole.role) {
        res.status(403).json({ error: 'User role not found' });
        return;
      }

      if (!allowedRoles.includes(userWithRole.role.name)) {
        res.status(403).json({ error: 'Insufficient permissions' });
        return;
      }

      next();
    } catch (error) {
      console.error('Role authorization error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}; 