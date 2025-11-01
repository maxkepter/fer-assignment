function buildQueryParams(params = {}) {
  const query = Object.entries(params)
    .flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(
          (v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`
        );
      } else if (value !== undefined && value !== null) {
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      } else {
        return [];
      }
    })
    .join("&");

  return query ? `?${query}` : "";
}

export const QueryParamsBuilder = {
  buildQueryParams,
};
