import { ddbPutRecord } from '@soundws/service-libs';
import config from '../config';

/**
 * Store a m3u8 record into the metadata table
 * @param {String} objectKey - key of the object in S3
 * @param {Object} contents - the m3u8 file contents
 * @returns void
 */
export default async (objectKey, contents) =>
  ddbPutRecord({
    TableName: config.m3u8FileTable,
    Item: {
      objectKey,
      tCreated: new Date().toISOString(),
      tLastRequested: new Date().toISOString(),
      contents,
      // ttl causes the record to be auto-deleted after a certain period of time
      // this in turn will trigger another lambda to remove the audio from s3
      ttl: Math.floor(new Date() / 1000) + config.m3u8FileTableTTL,
    },
  });
