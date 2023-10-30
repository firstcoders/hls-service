import { readFileSync } from 'fs';
import { resolve } from 'path';
import ddbGetRecord from '@soundws/service-libs/src/ddbGetRecord';
import lambdaInvoke from '@soundws/service-libs/src/lambdaInvoke';
import { handler } from '../../src/handlers/getM3u8';
import event from '../events/getM3u8';
import generateUrlForObject from '../../src/services/generateUrlForObject';
import config from '../../src/config';

jest.mock('@soundws/service-libs/src/ddbGetRecord');
jest.mock('@soundws/service-libs/src/ddbPutRecord');
jest.mock('@soundws/service-libs/src/lambdaInvoke');
jest.mock('@soundws/service-libs/src/logger');
jest.mock('../../src/services/generateUrlForObject');

config.createM3U8LambdaArn = 'arn:thisismycreatefunction';
config.signedUrlExpiresIn = 1234;
config.CORSAllowedOrigins = ['https://www.somesite.com'];

const indexFile = readFileSync(resolve(__dirname, '..', 'fixtures', 'index.m3u8'), {
  encoding: 'utf8',
});

describe('getM3u8', () => {
  describe('when requestOptions are not valid', () => {
    it('returns 400 with appropriate error messages', async () => {
      const response = await handler(event);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatch(/sourceUrl origin not permitted/);
    });
  });

  describe('when requestOptions are valid', () => {
    beforeEach(() => {
      // in allowed origins
      event.queryStringParameters.sourceUrl = 'https://d2m8h53em6mi65.cloudfront.net/drums.wav';

      // mock signing a url
      generateUrlForObject.mockResolvedValue('https://this-is-a-signed-url/drums.wav?key=blah');

      // mock the request that checks the cache
      ddbGetRecord.mockResolvedValue({ contents: indexFile });
    });

    it('returns a 200 with correct Content-Type', async () => {
      const response = await handler(event);

      expect(response.statusCode).toBe(200);
      expect(response.headers['Content-Type']).toBe('application/x-mpegURL');
    });

    it('returns a 200 with appropriate CORS headers', async () => {
      const response = await handler(event);

      expect(response.statusCode).toBe(200);
      expect(response.headers['Access-Control-Allow-Origin']).toBe('https://www.somesite.com');
      expect(response.headers['Access-Control-Max-Age']).toBe(86400);
    });

    describe('when the #sourceUrl object is not in the cache', () => {
      it('generates the m3u8 and then returns a 200 with the the m3u8', async () => {
        const response = await handler(event);

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatch(/https:\/\/this-is-a-signed-url\/drums.wav\?key=blah/);
      });
    });

    describe('when the #sourceUrl object is in the cache', () => {
      beforeEach(() => {
        ddbGetRecord
          .mockResolvedValueOnce(undefined) // return undefined for the checking of cache
          .mockResolvedValueOnce({ contents: indexFile }); // return contents for the second requests after creation of the cache record
      });

      it('returns a 200 with the cached m3u8', async () => {
        const response = await handler(event);

        expect(response.statusCode).toBe(200);

        expect(lambdaInvoke.mock.calls[0][0]).toStrictEqual({
          FunctionName: 'arn:thisismycreatefunction',
          InvocationType: 'RequestResponse',
          Payload:
            '{"queryStringParameters":{"sourceUrl":"https://d2m8h53em6mi65.cloudfront.net/drums.wav"}}',
        });

        expect(response.body).toMatch(/https:\/\/this-is-a-signed-url\/drums.wav\?key=blah/);
      });
    });

    describe('when #queryParams.signObjectUrls is undefined', () => {
      it('signs the object Urls', async () => {
        const response = await handler(event);
        expect(response.body).toMatch(/https:\/\/this-is-a-signed-url\/drums.wav\?key=blah/);
      });
    });

    describe('when #queryParams.signObjectUrls is false', () => {
      it('does not sign the object Urls', async () => {
        const response = await handler({
          ...event,
          queryStringParameters: { ...event.queryStringParameters, signObjectUrls: 'false' },
        });
        expect(response.body).not.toMatch(/https:\/\/this-is-a-signed-url\/drums.wav\?key=blah/);
        expect(response.body).toMatch(/sound-ws\/hls-srv\//);
      });
    });
  });
});
