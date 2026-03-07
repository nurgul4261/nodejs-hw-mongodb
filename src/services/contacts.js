import { DEFAULT_PAGINATION_VALUES } from "../constants/pagination.js";
import { Contacts } from "../db/models/contacts.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

const getContacts = async ({
    page = DEFAULT_PAGINATION_VALUES.page,
    perPage = DEFAULT_PAGINATION_VALUES.perPage,
    sortBy = DEFAULT_PAGINATION_VALUES.sortBy,
    sortOrder = DEFAULT_PAGINATION_VALUES.sortOrder,
    filter = {},
} = {}) => {
 
    const skip = (page - 1) * perPage;
    const limit = perPage;
    
    const contactQuery = Contacts.find();

    if (filter.contactType) {
        contactQuery.where('contactType').equals(filter.contactType);
    }

    if (filter.isFavourite !== undefined) {
        contactQuery.where('isFavourite').equals(filter.isFavourite);
    }

    const [totalCount, contacts] = await Promise.all([
    Contacts.find().merge(contactQuery).countDocuments(),
    contactQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

    const pagination = calculatePaginationData(totalCount, page, perPage);

    return { 
        data: contacts,
        pagination,
    };
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