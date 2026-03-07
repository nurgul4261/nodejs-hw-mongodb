import { DEFAULT_PAGINATION_VALUES } from '../constants/pagination.js';

const parseNumber = (value, defaultValue) => {
    const parseValue = Number(value);
    return isNaN(parseValue) ? defaultValue : parseValue;
}

export const parsePaginationParams = (query) => {
    const page = parseNumber(query.page, DEFAULT_PAGINATION_VALUES.page);
    const perPage = parseNumber(query.perPage, DEFAULT_PAGINATION_VALUES.perPage);
    return { page, perPage };
}