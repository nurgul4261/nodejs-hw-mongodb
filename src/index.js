import './utils/env.js'; 
import { TEMP_FOLDER, UPLOAD_FOLDER } from './constants/index.js';
import initMongoConnection from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import { createFileIfNotExist } from './utils/createFileIfNotExist.js';

const bootstrap = async () => {
  await initMongoConnection();
  await createFileIfNotExist(UPLOAD_FOLDER);
  await createFileIfNotExist(TEMP_FOLDER);
  setupServer();
};

bootstrap();

export default bootstrap;