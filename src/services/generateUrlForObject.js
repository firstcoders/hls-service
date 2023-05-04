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
import { s3SignUrl, cloudfrontSignUrl, logger } from '@soundws/service-libs';
import config from '../config';

/**
 * Creates a signed cloudfront url. Falls back to creating a signed S3 url
 *
 * @param {String} key - the S3 key
 */
export default async (key) => {
  try {
    return cloudfrontSignUrl({
      cloudfrontDomain: config.cloudfrontDomain,
      key,
      keyPairId: config.cloudfrontKeypairId,
      privateKey: config.cloudfrontPrivateKeyString,
      expires: config.signedUrlExpiresIn,
    });
  } catch (err) {
    logger.info('Failed to generate signed Cloudfront URL. Signing S3 url.');
    return s3SignUrl(config.audioBucketName, key, {
      expiresIn: config.signedUrlExpiresIn,
    });
  }
};
