import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();

if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

export default {
  port: parseInt(process.env.PORT ?? '3000', 10),
  databaseURL: process.env._DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },
  api: {
    prefix: '/api',
  },
};
