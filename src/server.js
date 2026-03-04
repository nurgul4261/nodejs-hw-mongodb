import express from 'express';
import { pinoHttp } from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const PORT = process.env.PORT;

export const createServer = () => {
  const app = express();
  
  app.use(cors());
  app.use(express.json({
    limit: '1mb',
  }));
  app.use(
    pinoHttp({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.send('Hello world!');
  });

  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export const setupServer = () => {
  createServer();
};


