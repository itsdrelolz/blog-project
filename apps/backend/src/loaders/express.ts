import express from 'express';
import cors from 'cors';
import passport from 'passport';
import { authMiddleware } from '../api/middlewares/auth.middleware';
import authRouter from '../api/routes/auth.routes';
import creatorRouter from '../api/routes/creator.routes';
import publicRouter from '../api/routes/public.routes';
import roleRouter from '../api/routes/role.routes';

export default ({ app }: { app: express.Application }) => {
  // CORS configuration
  const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ['https://blog-project-ten-phi.vercel.app']
    : ['http://localhost:5173', 'http://localhost:3000'];

  // Add FRONTEND_URL to allowed origins if it exists
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }

  const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  
  // Global middleware
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(passport.initialize());

  // Routes
  app.use('/auth', authRouter);
  app.use('/public', publicRouter);
  app.use('/creator', authMiddleware, creatorRouter);
  app.use('/roles', authMiddleware, roleRouter);

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
