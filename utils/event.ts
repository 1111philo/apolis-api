export let event = {
  httpMethod: "",
  path: "",
  queryStringParameters: {},
  body: {},
  requestContext: {},
};

export const setEvent = (rawEvent) => {
  console.log(rawEvent);

  try {
    rawEvent.body ? (rawEvent.rawBody = rawEvent.body) : null;
    rawEvent.body ? (rawEvent.body = JSON.parse(rawEvent.body)) : null;
    rawEvent.rawPath ? (rawEvent.path = rawEvent.rawPath) : null;
    !rawEvent.httpMethod
      ? (rawEvent.httpMethod = rawEvent.requestContext?.http?.method)
      : null;
  } catch {}

  event = rawEvent;
  return event;
};

export const extractPaginationParams = (event) => {
  let paginationParams = {
    offset: 0,
    limit: 10,
  };
  try {
    if (event.body) {
      if (event.body.limit) {
        paginationParams.limit = event.body.limit;
      }

      if (event.body.offset) {
        paginationParams.offset = event.body.offset;
      }
    } else if (event.queryStringParameters) {
      if (event.queryStringParameters.limit) {
        paginationParams.limit = event.queryStringParameters.limit;
      }

      if (event.queryStringParameters.offset) {
        paginationParams.offset = event.queryStringParameters.offset;
      }
    }
  } catch {}
  return paginationParams;
};

export const extractSortParams = (event) => {
  let sortParams = {
    sortBy: "id",
    sort: "asc",
  };
  try {
    if (event.body) {
      if (event.body.sortBy) {
        sortParams.sortBy = event.body.sortBy;
      }

      if (event.body.sort) {
        sortParams.sort = event.body.sort;
      }
    } else if (event.queryStringParameters) {
      if (event.queryStringParameters.sortBy) {
        sortParams.sortBy = event.queryStringParameters.sortBy;
      }

      if (event.queryStringParameters.sort) {
        sortParams.sort = event.queryStringParameters.sort;
      }
    }
  } catch {}
  return sortParams;
};
