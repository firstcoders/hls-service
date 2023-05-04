import { s3SignUrl, cloudfrontSignUrl } from '@soundws/service-libs';
import generateUrlForObject from '../../src/services/generateUrlForObject';
import config from '../../src/config';

jest.mock('@soundws/service-libs');

config.cloudfrontDomain = 'cloudfront.domain';
config.cloudfrontKeypairId = 'abcde';
config.cloudfrontPrivateKeyString = 'blahblahblah';
config.signedUrlExpiresIn = 12345;
config.audioBucketName = 'myaudiobucket';

describe('generateUrlForObject', () => {
  it('generates a signed cloudfront url', async () => {
    cloudfrontSignUrl.mockReturnValue('https://cloudfront.domain/get-it-here/drums.wav?key=blah');

    const signedUrl = await generateUrlForObject('/get-it-here/drums.wav');

    expect(signedUrl).toBe('https://cloudfront.domain/get-it-here/drums.wav?key=blah');

    expect(cloudfrontSignUrl.mock.calls[0][0]).toStrictEqual({
      cloudfrontDomain: 'cloudfront.domain',
      key: '/get-it-here/drums.wav',
      keyPairId: 'abcde',
      privateKey: 'blahblahblah',
      expires: 12345,
    });
  });

  it('falls back to generating a S3 signed url', async () => {
    cloudfrontSignUrl.mockImplementation(() => {
      throw new Error('cannot sign url');
    });

    s3SignUrl.mockResolvedValue('https://s3.myaudiobucket.com/get-it-here/drums.wav?key=blah');

    const signedUrl = await generateUrlForObject('/get-it-here/drums.wav');

    expect(signedUrl).toBe('https://s3.myaudiobucket.com/get-it-here/drums.wav?key=blah');
    expect(s3SignUrl.mock.calls[0][0]).toBe('myaudiobucket');
    expect(s3SignUrl.mock.calls[0][1]).toBe('/get-it-here/drums.wav');
    expect(s3SignUrl.mock.calls[0][2]).toStrictEqual({ expiresIn: 12345 });
  });
});
