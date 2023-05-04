import { rmdir } from 'fs/promises';
import { logger, createHandler, getCorsHeaders, s3PutFolder } from '@soundws/service-libs';
import parseRequestOptions from '../services/parseRequestOptions';
import getKey from '../services/getKey';
import ddbGetObject from '../services/ddbGetObject';
import ddbPutObject from '../services/ddbPutObject';
import audioSegment from '../services/audioSegment';
import config from '../config';
import getCacheKey from '../services/getCacheKey';

const handleRequest = async (event) => {
  logger.debug('Running with config', config);

  const options = parseRequestOptions(event);

  let cacheKey;
  try {
    cacheKey = await getCacheKey(options.sourceUrl);
  } catch (err) {
    if (err.code === 'GetEtagFromOriginError') {
      return {
        statusCode: 400,
        body: JSON.stringify({
          code: err.code,
          errors: ['The origin server did not respond with an etag'],
        }),
      };
    }

    throw err;
  }

  // get the fully qualified key on S3
  const key = getKey(cacheKey, options);

  // Check if we already have segmented this file previously
  // TODO getM3u8 checks S3. Perhaps check S3 here too instead of ddb
  logger.debug(`Checking if key ${key} exists in cache`);
  const m3u8File = await ddbGetObject(key);

  // We have already processed the file
  if (m3u8File) {
    return {
      statusCode: 200, // 409, an error code may trigger retry
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'The file was already processed. Skipping',
        key,
      }),
    };
  }

  // process the audio
  const { path, m3u8FileContents } = await audioSegment({
    folderPrefix: key,
    ...options,
  });

  // push the files to s3
  await s3PutFolder(config.audioBucketName, key, path, {
    CacheControl: `max-age=${config.s3CacheDuration}`,
  });

  // cleanup
  await rmdir(path, { recursive: true, force: true });

  // store the data in dynamodb
  await ddbPutObject(key, m3u8FileContents);

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Created file',
      key,
    }),
  };
};

const handler = createHandler(async (event) => {
  try {
    const response = await handleRequest(event);

    return {
      ...response,
      headers: {
        // all is json
        'Content-Type': 'application/json',

        // mix in the cors headers
        ...getCorsHeaders({
          requestHeaders: event.headers,
          allowedOrigins: config.CORSAllowedOrigins,
        }),

        ...response.headers,
      },
    };
  } catch (error) {
    logger.error('The request failed', { error: error.message });
    throw error;
  }
});

// eslint-disable-next-line import/prefer-default-export
export { handler };
