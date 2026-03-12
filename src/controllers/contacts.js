import createHttpError from 'http-errors';
import { getContacts, getContactsById, addContact, deleteContactById, updateContact} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToCloudinary } from '../utils/createFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';


export const getContactsController = async (req, res) => {
    const queryParams = req.query;
    const userId = req.user._id;
    
    const { page, perPage } = parsePaginationParams(queryParams);
    const { sortBy, sortOrder } = parseSortParams(queryParams);
    const filter = parseFilterParams(queryParams);

    const contacts = await getContacts({ page, perPage, sortBy, sortOrder, filter, userId });
    res.status(200).send({
        message: 'Contacts found',
        status: 200,
        data: contacts,
    });
};

export const getContactsByIdController = async (req, res) => {
    const { contactId } = req.params;
    const userId = req.user._id;
    const contact = await getContactsById(contactId, userId);

    if (!contact) {
        throw createHttpError(404, 'Contact not found');
    }
    
    res.status(200).send({
        message: 'Contact found',
        status: 200,
        data: contact,
    });
};

export const addContactController = async (req, res) => {
    const newContact = req.body;
    const userId = req.user._id; 
    const photo = req.file;
    let photoUrl = null; 

    if (photo) {
        if (process.env.ENABLE_CLOUDINARY === 'true') {
            photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToUploadDir(photo);
        }
    }

    const createdContact = await addContact({ ...newContact, userId, photo: photoUrl });

    res.status(201).send({
        message: 'Contact created',
        status: 201,
        data: createdContact,
    });
};

export const deleteContactController = async (req, res) => {
    const { contactId } = req.params;
    const userId = req.user._id;
    const deletedContact = await deleteContactById(contactId, userId);
    if (!deletedContact) {
        throw createHttpError(404, 'Contact not found');
    }
    res.status(204).send();
};

export const updatePutContactController = async (req, res) => {
    const { contactId } = req.params;
    const userId = req.user._id;
    const newData = req.body;
    const updatedContact = await updateContact(contactId, userId, newData, { upsert: true });
    if (!updatedContact) {
        throw createHttpError(404, 'Contact not found');
    }

    const status = updatedContact.isNew ? 201 : 200;
    const message = updatedContact.isNew ? 'Contact created' : 'Contact updated';

    res.status(status).send({
        message: message,
        status: status,
        data: updatedContact,
    });
};

export const updatePatchContactController = async (req, res) => {
    const { contactId } = req.params;
    const userId = req.user._id;
    const newData = req.body;
    const updatedContact = await updateContact(contactId, userId, newData, { upsert: false });
    if (!updatedContact) {
        throw createHttpError(404, 'Contact not found');
    }

    res.status(200).send({
        message: 'Contact updated',
        status: 200,
        data: updatedContact,
    });
};

