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
import ddbUpdateRecord from '@soundws/service-libs/src/ddbUpdateRecord';
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
