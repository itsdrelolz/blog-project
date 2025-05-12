import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { RoleService } from '../../services/role.services';
import { authMiddleware } from '../middlewares/auth.middleware';
import { Request, Response, NextFunction } from 'express';

const router = Router();
const roleService = new RoleService(new PrismaClient());

// Get all roles
router.get('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await roleService.getAllRoles();
    res.json({ roles });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
    next(error);
  }
});

// Create a new role
router.post('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;
    const role = await roleService.createRole({ name, description });
    res.status(201).json({ role });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ error: 'Failed to create role' });
    next(error);
  }
});

// Update a role
router.put('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;
    const role = await roleService.updateRole(id, { name, description });
    res.json({ role });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Failed to update role' });
    next(error);
  }
});

// Delete a role
router.delete('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    await roleService.deleteRole(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ error: 'Failed to delete role' });
    next(error);
  }
});

export default router; 