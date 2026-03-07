import { CONTACTS_SORTABLE_FIELDS, DEFAULT_PAGINATION_VALUES, SORT_ORDERS } from "../constants/pagination.js";

const parseSortOrder = (order) => {
    const knownSortOrders = [SORT_ORDERS.ASC, SORT_ORDERS.DESC];

    if (knownSortOrders.includes(order)) {
        return order;
    }
    return DEFAULT_PAGINATION_VALUES.sortOrder;
}

const parseSortBy = (sortBy) => {
    if (CONTACTS_SORTABLE_FIELDS.includes(sortBy)) {
        return sortBy;
    }
        return DEFAULT_PAGINATION_VALUES.sortBy;
}


export const parseSortParams = (query) => {
    const sortOrder = parseSortOrder(query.sortOrder);
    const sortBy = parseSortBy(query.sortBy);

    return {
        sortBy,
        sortOrder,
    }
}
