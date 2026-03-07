
export const calculatePaginationData = (total, page, perPage) => {
    const totalCount = total;
    const totalPages = Math.ceil(totalCount / perPage);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
        currentPage: page,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
    };
}