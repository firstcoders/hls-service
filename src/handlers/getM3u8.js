import axios from 'axios';
import axiosRetry from 'axios-retry';
import { logger, createHandler, getCorsHeaders, lambdaInvoke } from '@soundws/service-libs';
import ddbGetObject from '../services/ddbGetObject';
import ddbTouchObject from '../services/ddbTouchObject';
import parseRequestOptions from '../services/parseRequestOptions';
import getKey from '../services/getKey';
import config from '../config';
import generateUrlForObject from '../services/generateUrlForObject';
import getCacheKey from '../services/getCacheKey';

// Make things more robust by retrying stuff
// https://www.npmjs.com/package/axios-retry
axiosRetry(axios, { retries: 3 });

const handleRequest = async (event) => {
  let options;
  try {
    options = parseRequestOptions(event);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ errors: err.errors }),
    };
  }

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

  // we don't wait for touch as it can run concurrently
  const touchPromise = ddbTouchObject(key).catch(() => {});
  let record = await ddbGetObject(key);

  if (!record) {
    logger.info(`Key ${key} does not exist. Creating.`);

    // We delegate creating of the m3u8 to another lambda. We want to keep this lambda nice and lean in order to minimise
    // cold-start times so we don't include the layers required by createM3u8; also we want to keep memory low.
    // TODO for now this seems the simples solution, however using SQS/SNS may be required. Another alternative
    // is step functions, however keeping things simple wins the day for now.
    await lambdaInvoke({
      FunctionName: config.createM3U8LambdaArn,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        queryStringParameters: event.queryStringParameters,
      }),
    });

    record = await ddbGetObject(key, true);
  }

  // fetch keys from m3u8
  const objects = record.contents.match(
    new RegExp(
      `${
        config.s3FolderPrefix
        // eslint-disable-next-line no-useless-escape
      }/${cacheKey}(\/[a-z0-9]+)+[a-z]+\.segment-[0-9]+\.[a-z0-9]+`,
      'gs'
    )
  );

  // create a signed url for each object
  const map = await Promise.all(
    objects.map((object) =>
      generateUrlForObject(object).then((url) => ({
        object,
        url,
      }))
    )
  );

  // replace each object with the signed url
  let body = record.contents;
  map.forEach(({ object, url }) => {
    body = body.replace(object, url);
  });

  // make sure the promise ^ resolves before returning
  await touchPromise;

  return {
    statusCode: 200,
    headers: {
      'Cache-Control': `public, max-age=${Math.floor(config.signedUrlExpiresIn * 0.9)}`, // signed url expiry, deducting a margin
      'Content-Type': 'application/x-mpegURL',
    },
    body,
  };
};

const handler = createHandler(async (event) => {
  logger.debug('Running with config', config);

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
