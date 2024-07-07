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
import logger from '@firstcoders/service-libs/src/logger';
import createHandler from '@firstcoders/service-libs/src/createHandler';
import lambdaInvokeCreateM3u8 from '../services/lambdaInvokeCreateM3u8';
import ddbGetObject from '../services/ddbGetObject';
import ddbTouchObject from '../services/ddbTouchObject';
import parseRequestOptions from '../services/parseRequestOptions';
import getS3Key from '../services/getS3Key';
import config from '../config';
import getCacheKey from '../services/getCacheKey';
import transformMu38ObjectPathsToUrls from '../services/transformMu38ObjectPathsToUrls';
import createCORSResponse from '../services/createCORSResponse';

const handler = createHandler(async (event) => {
  logger.debug('Running with config', config);

  let options;
  try {
    options = parseRequestOptions(event);
  } catch (err) {
    return createCORSResponse(event, {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ errors: err.errors }),
    });
  }

  const cacheKey = getCacheKey(options.sourceUrl);

  // get the fully qualified key on S3
  const key = getS3Key(cacheKey, options);

  // we don't wait for touch as it can run concurrently
  const touchPromise = ddbTouchObject(key).catch(() => {});

  // check ddb for a record
  let record = await ddbGetObject(key);

  // if this doesnt exist, create...
  if (!record) {
    logger.info(`Key ${key} does not exist. Creating.`);

    // create the m3u8 in a separate lambda with more ooomph
    await lambdaInvokeCreateM3u8(event);

    // get the created record (with consistent read)
    record = await ddbGetObject(key, true);
  }

  let body = record.contents;

  // transform the segment keys in the m3u8 into a fully qualified, signed url
  if (options.signObjectUrls) {
    body = await transformMu38ObjectPathsToUrls(record.contents, cacheKey);
  }

  // make sure the promise ^ resolves before returning
  await touchPromise;

  return createCORSResponse(event, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/x-mpegURL',
    },
    body,
  });
});

// eslint-disable-next-line import/prefer-default-export
export { handler };
