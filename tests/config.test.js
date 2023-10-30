import config from '../src/config';

describe('config', () => {
  it('sets the corect values', () => {
    expect(config).toStrictEqual({
      stage: undefined,
      logLevel: undefined,
      audioBucketName: undefined,
      audioOutputMaxDuration: 600,
      CORSAllowedOrigins: undefined,
      s3FolderPrefix: 'sound-ws/hls-srv/audio',
      jwtAudience: 'api.sound.ws',
      m3u8FileTable: undefined,
      m3u8FileTableTTL: 2592000,
      signedUrlExpiresIn: 900,
      createM3U8LambdaArn: undefined,
      s3CacheDuration: 2592000,
      validSampleRates: [22050],
      validBitrates: [192],
      validAudioFormats: ['mp3'],
      validSegmentTimes: [5],
      allowedAudioOrigins: ['*'],
    });
  });
});
