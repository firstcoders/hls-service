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
import is from '@sindresorhus/is';
import config from '../config';
import parseCsv from '../libs/parseCsv';

/**
 * @param {Object} event
 */
export default (event) => {
  const { sampleRate, bitRate, segmentTime, format, sourceUrl, signObjectUrls } =
    event.queryStringParameters || {};
  const { authorizer } = event.requestContext || {};
  const { validSampleRates, validBitrates, validSegmentTimes, validAudioFormats } = config;
  const allowedAudioOrigins = authorizer?.allowedAudioOrigins
    ? parseCsv(authorizer?.allowedAudioOrigins)
    : config.allowedAudioOrigins;

  const options = {
    sourceUrl,
    signObjectUrls: signObjectUrls !== 'false' && signObjectUrls !== false,
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
