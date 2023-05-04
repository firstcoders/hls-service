import { createHandler, createPolicy, verifyAccessToken, logger } from '@soundws/service-libs';
import config from '../config';

const handler = createHandler(async (event) => {
  logger.debug('Running with config', config);

  try {
    const token = event?.authorizationToken?.replace('Bearer ', '');
    if (!token) throw new Error('no bearer token in request');

    const decoded = verifyAccessToken(token, config.swsSecret, {
      audience: config.jwtAudience,
    });
    return createPolicy(event, 'Allow', decoded.sub, decoded);
  } catch (error) {
    return createPolicy(event, 'Deny');
  }
});

// eslint-disable-next-line import/prefer-default-export
export { handler };
