import createHttpError from 'http-errors';
import { getContacts, getContactsById, addContact, deleteContactById, updateContact} from '../services/contacts.js';

export const getContactsController = async (req, res) => {
    const contacts = await getContacts();
    res.status(200).send({
        message: 'Contacts found',
        status: 200,
        data: contacts,
    });
};

export const getContactsByIdController = async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactsById(contactId);
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

    const createdContact = await addContact(newContact); 
    res.status(201).send({
        message: 'Contact added',
        status: 201,
        data: createdContact,
    });
};

export const deleteContactController = async (req, res) => {
    const { contactId } = req.params;
    const deletedContact = await deleteContactById(contactId);
    if (!deletedContact) {
        throw createHttpError(404, 'Contact not found');
    }
    res.status(204).send();
};

export const updatePutContactController = async (req, res) => {
    const { contactId } = req.params;
    const newData = req.body;
    const updatedContact = await updateContact(contactId, newData, { upsert: true });
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
    const newData = req.body;
    const updatedContact = await updateContact(contactId, newData, { upsert: false });
    if (!updatedContact) {
        throw createHttpError(404, 'Contact not found');
    }

    res.status(200).send({
        message: 'Contact updated',
        status: 200,
        data: updatedContact,
    });
};
