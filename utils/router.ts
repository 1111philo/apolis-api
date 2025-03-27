import { event } from './event';

export const router = async (routes) => {
  for (const [routeName, routeFunction] of Object.entries(routes)) {
    if (event.path.endsWith(`/${routeName}`)) {
      return routeFunction();
    }
  }
  return {
    statusCode: 404,
    body: JSON.stringify({ message: 'Path not found' }),
  };
};
