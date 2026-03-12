import { Router } from 'express';
import { getContactsByIdController, getContactsController, addContactController, deleteContactController, updatePatchContactController, updatePutContactController } from '../controllers/contacts.js'; 
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createContactSchema, updateContactSchema } from '../validators/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authorize } from '../middlewares/authorize.js';
import { checkRoles } from '../middlewares/checkRoles.js';
import { USER_ROLES } from '../constants/index.js';
import { upload } from '../middlewares/upload.js';

const contactsRouter = Router();
contactsRouter.use(authorize);

contactsRouter.get('/', checkRoles(USER_ROLES.ADMIN), ctrlWrapper(getContactsController));

contactsRouter.get('/:contactId', isValidId, checkRoles(USER_ROLES.USER, USER_ROLES.ADMIN), ctrlWrapper(getContactsByIdController));

contactsRouter.post('/', checkRoles(USER_ROLES.ADMIN, USER_ROLES.USER), upload.single('photo'), validateBody(createContactSchema), ctrlWrapper(addContactController));

contactsRouter.delete('/:contactId', isValidId, checkRoles(USER_ROLES.ADMIN), ctrlWrapper(deleteContactController));

contactsRouter.patch('/:contactId', isValidId, checkRoles(USER_ROLES.USER, USER_ROLES.ADMIN), upload.single('photo'), validateBody(updateContactSchema), ctrlWrapper(updatePatchContactController));

contactsRouter.put('/:contactId', isValidId, checkRoles(USER_ROLES.ADMIN), validateBody(createContactSchema), ctrlWrapper(updatePutContactController));

export default contactsRouter;