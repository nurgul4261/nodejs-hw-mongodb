import express from 'express';
import { pinoHttp } from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_FOLDER } from './constants/index.js';
import { env } from './utils/env.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

dotenv.config();

const PORT = process.env.PORT || env('PORT') || 3000;

export const createServer = () => {
  const app = express();
  
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json({
    limit: '1mb',
  })
  );

  app.use("/uploads", express.static(UPLOAD_FOLDER));

  app.use('/api-docs', swaggerDocs());

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
  app.use('/auth', authRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export const setupServer = () => {
  createServer();
};


