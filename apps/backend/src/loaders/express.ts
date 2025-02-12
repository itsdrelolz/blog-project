import express from 'express';
import cors from 'cors';
import passport from 'passport';
import { authMiddleware } from '../api/middlewares/auth.middleware';
import authRouter from '../api/routes/auth.routes';
import creatorRouter from '../api/routes/creator.routes';
import publicRouter from '../api/routes/public.routes';

export default ({ app }: { app: express.Application }) => {
  // Global middleware
  app.use(cors());
  app.use(express.json());
  app.use(passport.initialize());

  // Routes
  app.use('/auth', authRouter);
  app.use('/public', publicRouter);
  app.use('/creator', authMiddleware, creatorRouter);

  // Error handling
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong!' });
    },
  );

  return app;
};
