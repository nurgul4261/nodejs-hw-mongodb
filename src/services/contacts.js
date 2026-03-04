import { Contacts } from "../db/models/contacts.js";

const getContacts = async () => {
    const contacts = await Contacts.find();
    return contacts;
};

const getContactsById = async (contactId) => {
    const contact = await Contacts.findById(contactId);
    return contact;
};

const addContact = async (contact) => {
    const newContact = await Contacts.create(contact);
    return newContact;
};

const deleteContactById = async (contactId) => {
    const deletedContact = await Contacts.findOneAndDelete({ _id: contactId });
    return deletedContact;
};

const updateContact = async (contactId, newData, options = {}) => {
    const result = await Contacts.findOneAndUpdate(
        { _id: contactId },
        { $set: newData },
        { includeResultMetadata: true, new: true, ...options }
    );
    if (result.value) {
        return {
            contact: result.value,
            isNew: Boolean(result.lastErrorObject.upserted),
        }
    };
    return null;
};

export { getContacts, getContactsById, addContact, deleteContactById, updateContact };
