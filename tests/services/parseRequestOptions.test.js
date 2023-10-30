import parseRequestOptions from '../../src/services/parseRequestOptions';
import config from '../../src/config';

config.validSampleRates = [100, 200];
config.validSegmentTimes = [5, 10];
config.validAudioFormats = ['mp3', 'm4a'];
config.validBitrates = [128, 192];

let event;

const getError = (fn) => {
  try {
    fn();
  } catch (error) {
    return error;
  }

  return undefined;
};

describe('parseRequestOptions', () => {
  beforeEach(() => {
    event = {
      queryStringParameters: {},
      requestContext: {
        authorizer: {
          allowedAudioOrigins: 'https://get-it-here.com',
        },
      },
    };
  });

  describe('when the request is invalid', () => {
    it('throws an error if sourceUrl is not an url', () => {
      const error = getError(() => parseRequestOptions(event));

      expect(error.code).toBe('BadRequest');
      expect(error.errors).toStrictEqual([
        'sourceUrl must be a url',
        'sourceUrl origin not permitted',
      ]);
    });

    it('throws an error if sourceUrl not in the allowed audio origins', () => {
      event.queryStringParameters.sourceUrl = 'https://get-it-somewhere-else.com';

      const error = getError(() => parseRequestOptions(event));

      expect(error.code).toBe('BadRequest');
      expect(error.errors).toStrictEqual(['sourceUrl origin not permitted']);
    });

    it('throws an error if sampleRate not a valid', () => {
      event.queryStringParameters.sourceUrl = 'https://get-it-here.com';
      event.queryStringParameters.sampleRate = 999;

      const error = getError(() => parseRequestOptions(event));

      expect(error.code).toBe('BadRequest');
      expect(error.errors).toStrictEqual(['sampleRate must be on of 100|200']);
    });

    it('throws an error if bitRate not a valid', () => {
      event.queryStringParameters.sourceUrl = 'https://get-it-here.com';
      event.queryStringParameters.bitRate = 999;

      const error = getError(() => parseRequestOptions(event));

      expect(error.code).toBe('BadRequest');
      expect(error.errors).toStrictEqual(['bitRate must be one of 128|192']);
    });

    it('throws an error if segmentTime not a valid', () => {
      event.queryStringParameters.sourceUrl = 'https://get-it-here.com';
      event.queryStringParameters.segmentTime = 999;

      const error = getError(() => parseRequestOptions(event));

      expect(error.code).toBe('BadRequest');
      expect(error.errors).toStrictEqual(['segmentTime must be one of 5|10']);
    });

    it('throws an error if format not a valid', () => {
      event.queryStringParameters.sourceUrl = 'https://get-it-here.com';
      event.queryStringParameters.format = 'ogg';

      const error = getError(() => parseRequestOptions(event));

      expect(error.code).toBe('BadRequest');
      expect(error.errors).toStrictEqual(['format must be one of mp3|m4a']);
    });
  });

  describe('when the request is valid', () => {
    it('returns parsed options', () => {
      event.queryStringParameters.sourceUrl = 'https://get-it-here.com';

      const options = parseRequestOptions(event);

      expect(options).toStrictEqual({
        sourceUrl: 'https://get-it-here.com',
        sampleRate: 100,
        bitRate: 128,
        segmentTime: 5,
        signObjectUrls: true,
        format: 'mp3',
      });
    });
  });
});
