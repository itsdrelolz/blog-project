import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { StorageService } from '../../services/storage.service';

const storageService = new StorageService();
const upload = storageService.getMulterStorage();

export const uploadMiddleware = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File size too large. Maximum size is 5MB' });
        }
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  };
}; 