import { ddbGetRecord } from '@soundws/service-libs';
import config from '../config';

export default async (objectKey, consistentRead = false) =>
  ddbGetRecord({
    TableName: config.m3u8FileTable,
    ConsistentRead: consistentRead,
    Key: {
      objectKey,
    },
  });
