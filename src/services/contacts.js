import { Contacts } from "../db/models/contacts.js";

const getContacts = async () => {
    const contacts = await Contacts.find();
    return contacts;
};

const getContactsById = async (contactId) => {
    const contact = await Contacts.findById(contactId);
    return contact;
};

export { getContacts, getContactsById };