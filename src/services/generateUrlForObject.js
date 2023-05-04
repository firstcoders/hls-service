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
