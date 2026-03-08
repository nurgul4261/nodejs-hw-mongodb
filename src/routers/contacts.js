import { Router } from 'express';
import { getContactsByIdController, getContactsController, addContactController, deleteContactController, updatePatchContactController, updatePutContactController } from '../controllers/contacts.js'; 
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createContactSchema, updateContactSchema } from '../validators/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getContactsController));
contactsRouter.get('/:contactId', isValidId, ctrlWrapper(getContactsByIdController));
contactsRouter.post('/', validateBody(createContactSchema), ctrlWrapper(addContactController));
contactsRouter.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));
contactsRouter.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(updatePatchContactController));
contactsRouter.put('/:contactId', isValidId, validateBody(createContactSchema), ctrlWrapper(updatePutContactController));

export default contactsRouter;
