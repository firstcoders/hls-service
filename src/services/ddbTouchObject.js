import { ddbUpdateRecord } from '@soundws/service-libs';
import config from '../config';

/**
 * Updates the tLastRequested on an object
 *
 * @param {String} objectKey
 */
export default async (objectKey) =>
  ddbUpdateRecord({
    TableName: config.m3u8FileTable,
    Key: {
      objectKey,
    },
    ConditionExpression: 'objectKey = :objectKey',
    UpdateExpression: 'set tLastRequested = :tLastRequested, #ttl = :x',
    ExpressionAttributeValues: {
      ':tLastRequested': new Date().toISOString(),
      // Bump the ttl: we want unused audio to be deleted after a time, but not used audio
      ':x': Math.floor(new Date() / 1000) + config.m3u8FileTableTTL,
      ':objectKey': objectKey,
    },
    ExpressionAttributeNames: {
      '#ttl': 'ttl',
    },
  });
