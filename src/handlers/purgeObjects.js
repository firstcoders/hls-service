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
import logger from '@soundws/service-libs/src/logger';
import createHandler from '@soundws/service-libs/src/createHandler';
import s3DeleteObject from '@soundws/service-libs/src/s3DeleteObject';
import config from '../config';

const handler = createHandler(async (event) => {
  logger.debug('Running with config', config);

  const promises = event.Records.filter((record) => record.eventName === 'REMOVE').map((record) => {
    const key = record.dynamodb?.Keys?.objectKey?.S;
    return s3DeleteObject(config.audioBucketName, key);
  });

  if (promises.length) {
    await Promise.all(promises);
    logger.debug(`Purge of objects on s3 successful`);
  } else {
    logger.debug(`Nothing to purge`);
  }
});

// eslint-disable-next-line import/prefer-default-export
export { handler };
