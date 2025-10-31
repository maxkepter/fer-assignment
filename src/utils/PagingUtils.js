function getPage(records, pageNumber, pageSize) {
  if (!Array.isArray(records) || pageSize <= 0 || pageNumber <= 0) {
    return [];
  }
  let totalRecord = records.length;
  let totalPages = Math.ceil(totalRecord / pageSize);
  if (pageNumber > totalPages) {
    return [];
  }
  let startIndex = pageSize * (pageNumber - 1);
  let endIndex = startIndex + pageSize;

  return {
    records: records,
    pageSize: pageSize,
    pageNumber: pageNumber,
    totalPages: totalPages,
    pagedRecords: records.slice(startIndex, endIndex),
    isFirstPage: pageNumber === 1,
    isLastPage: pageNumber === totalPages,
  };
}

export const PagingUtils = {
  getPage,
};
