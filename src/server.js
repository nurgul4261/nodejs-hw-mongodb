import express from 'express';
import { pinoHttp } from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import { getContacts } from './services/contacts.js';
import { getContactsById } from './services/contacts.js';

dotenv.config();

const PORT = process.env.PORT;

export const createServer = () => {
  const app = express();
  
  app.use(cors());
  app.use(express.json());
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

  app.get('/contacts', async (req, res) => {
    const contacts =await getContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactsById(contactId);
    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully found contact!',
      data: contact,
    });
  });

  app.use((req,res) => {
    res.status(404).send({ 
      message: 'Not found',
      status: 404
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export const setupServer = () => {
  createServer();
};


