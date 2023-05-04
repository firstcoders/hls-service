import is from '@sindresorhus/is';
import config from '../config';
import parseCsv from '../libs/parseCsv';

/**
 * @param {Object} event
 */
export default (event) => {
  const { sampleRate, bitRate, segmentTime, format, sourceUrl } = event.queryStringParameters || {};
  const { authorizer } = event.requestContext || {};
  const { validSampleRates, validBitrates, validSegmentTimes, validAudioFormats } = config;
  const allowedAudioOrigins = authorizer?.allowedAudioOrigins
    ? parseCsv(authorizer?.allowedAudioOrigins)
    : config.allowedAudioOrigins;

  const options = {
    sourceUrl,
    sampleRate: sampleRate ? parseInt(sampleRate, 10) : validSampleRates[0],
    bitRate: bitRate ? parseInt(bitRate, 10) : validBitrates[0],
    segmentTime: segmentTime ? parseInt(segmentTime, 10) : validSegmentTimes[0],
    format: format || validAudioFormats[0],
  };

  const errors = [];

  if (!is.urlString(options.sourceUrl)) {
    errors.push(`sourceUrl must be a url`);
  }

  // validate origins
  if (
    !options.sourceUrl ||
    (allowedAudioOrigins.indexOf('*') === -1 &&
      allowedAudioOrigins.find((v) => options.sourceUrl.indexOf(v) === 0) === undefined)
  ) {
    errors.push('sourceUrl origin not permitted');
  }

  if (!is.number(options.sampleRate) || validSampleRates.indexOf(options.sampleRate) === -1) {
    errors.push(`sampleRate must be on of ${validSampleRates.join('|')}`);
  }

  if (!is.number(options.bitRate) || validBitrates.indexOf(options.bitRate) === -1) {
    errors.push(`bitRate must be one of ${validBitrates.join('|')}`);
  }

  if (!is.number(options.segmentTime) || validSegmentTimes.indexOf(options.segmentTime) === -1) {
    errors.push(`segmentTime must be one of ${validSegmentTimes.join('|')}`);
  }

  if (!is.string(options.format) || validAudioFormats.indexOf(options.format) === -1) {
    errors.push(`format must be one of ${validAudioFormats.join('|')}`);
  }

  if (errors.length) {
    const error = new Error('Parsing options failed');
    error.errors = errors;
    error.code = 'BadRequest';
    throw error;
  }

  return options;
};
