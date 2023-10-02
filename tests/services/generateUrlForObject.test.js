import s3SignUrl from '@soundws/service-libs/src/s3SignUrl';
import generateUrlForObject from '../../src/services/generateUrlForObject';
import config from '../../src/config';

jest.mock('@soundws/service-libs/src/s3SignUrl');

config.signedUrlExpiresIn = 12345;
config.audioBucketName = 'myaudiobucket';

it('Generating a S3 signed url', async () => {
  s3SignUrl.mockResolvedValue('https://s3.myaudiobucket.com/get-it-here/drums.wav?key=blah');

  const signedUrl = await generateUrlForObject('/get-it-here/drums.wav', { expiresIn: 12345 });

  expect(signedUrl).toBe('https://s3.myaudiobucket.com/get-it-here/drums.wav?key=blah');
  expect(s3SignUrl.mock.calls[0][0]).toBe('myaudiobucket');
  expect(s3SignUrl.mock.calls[0][1]).toBe('/get-it-here/drums.wav');
  expect(s3SignUrl.mock.calls[0][2]).toStrictEqual({ expiresIn: 12345 });
});
