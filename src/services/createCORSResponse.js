import getCorsHeaders from '@soundws/service-libs/src/getCorsHeaders';
import config from '../config';

export default (event, response) => ({
  ...response,
  headers: {
    ...getCorsHeaders({
      origin: event.headers?.origin || event.headers?.Origin,
      allowedOrigins: config.CORSAllowedOrigins,
    }),
    ...response.headers,
  },
});
