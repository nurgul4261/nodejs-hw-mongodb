import createHttpError from "http-errors";
import { USER_ROLES } from "../constants/index.js";
import { getContactsById } from "../services/contacts.js";

export const checkRoles = (...allowedRoles) => async (req, res, next) => {
    const user = req.user;

    if (!user) {
        next(createHttpError(401, "User not authenticated"));
        return;
    }

    if (!allowedRoles.includes(user.role)) {
        next(createHttpError(403, "You do not have permission to perform this action"));
        return;
    }

    if (user.role === USER_ROLES.ADMIN) {
        next();
        return;
    }

    if (user.role === USER_ROLES.USER) {
        const { contactId } = req.params;

        if (contactId) {
            const contact = await getContactsById(contactId);

            if (!contact) {
                next(createHttpError(404, "Contact not found"));
                return;
            }

            if (contact.userId.toString() !== user._id.toString()) {
                next(createHttpError(403, "You do not have permission to perform this action"));
                return;
            }
        }
    }

    next();
};