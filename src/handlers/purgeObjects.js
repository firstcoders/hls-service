import { logger, createHandler, s3DeleteObject } from '@soundws/service-libs';
import config from '../config';

const handler = createHandler(async (event) => {
  logger.debug('Running with config', config);

  const promises = event.Records.filter((record) => record.eventName === 'REMOVE').map((record) => {
    const key = record.dynamodb?.Keys?.objectKey?.S;
    return s3DeleteObject(config.audioBucketName, key);
  });

  if (promises.length) {
    await Promise.all(promises);
    logger.debug(`Purge of objects on s3 successful`);
  } else {
    logger.debug(`Nothing to purge`);
  }
});

// eslint-disable-next-line import/prefer-default-export
export { handler };
