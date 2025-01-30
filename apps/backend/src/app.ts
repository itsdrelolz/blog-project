import 'reflect-metadata';
import express from 'express';
import config from './config';
import Logger from './loaders/logger';


async function startServer() {
  const app = express();

  await (await import('./loaders')).default({ expressApp: app });

  app
    .listen(config.port, () => {
      Logger.info(`
      #############################################
      🛡️  Server listening on port: ${config.port} 🛡️ 
      #############################################
    `);
    })
    .on('error', err => {
      Logger.error(err);
      process.exit(1);
    });
}

startServer();