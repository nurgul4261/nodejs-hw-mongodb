export const SORT_ORDERS = {
    ASC: 'asc',
    DESC: 'desc',
};  

export const DEFAULT_PAGINATION_VALUES = {
    page: 1,
    perPage: 5,
    sortOrder: SORT_ORDERS.ASC,
    sortBy: '_id',
};

export const CONTACTS_SORTABLE_FIELDS = [
    'name',
    'email',
    'phone',
    'isFavourite',
    'contactType',
];