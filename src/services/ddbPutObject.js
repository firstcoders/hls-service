/**
 * Copyright (C) 2019-2023 First Coders LTD
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
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
