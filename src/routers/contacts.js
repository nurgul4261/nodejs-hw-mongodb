import { Router } from 'express';
import { getContactsByIdController, getContactsController, addContactController, deleteContactController, updatePatchContactController, updatePutContactController } from '../controllers/contacts.js'; 
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getContactsController));
contactsRouter.get('/:contactId', ctrlWrapper(getContactsByIdController));
contactsRouter.post('/', ctrlWrapper(addContactController));
contactsRouter.delete('/:contactId', ctrlWrapper(deleteContactController));
contactsRouter.patch('/:contactId', ctrlWrapper(updatePatchContactController));
contactsRouter.put('/:contactId', ctrlWrapper(updatePutContactController));

export default contactsRouter;