import express from 'express';
import dotenv from 'dotenv';
import authRouter from './api/routes/auth.routes';
import passport from 'passport';
import cors from 'cors';
import creatorRouter from './api/routes/creator.routes';
import publicRouter from './api/routes/public.routes';
import { authMiddleware } from './api/middlewares/auth.middleware';

const app = express();

dotenv.config();
const PORT = process.env.PORT || 3000;

// Global middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Public routes (no auth required)
app.use('/api/auth', authRouter);
app.use('/api/public', publicRouter);

// Protected routes (auth required)
app.use('/api/creator', authMiddleware, creatorRouter);

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});

/** 
import 'reflect-metadata';
import config from './config';
import express from 'express';
import Logger from './loaders/logger';

async function startServer() {

const app = express();


const loader = await import('./loaders');
await loader.default({ expressApp: app });

app.listen(config.port, () => {
    Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
  }).on('error', err => {
    Logger.error(err);
    process.exit(1);
  });
}

startServer();
**/
