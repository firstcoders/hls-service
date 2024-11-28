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
import logger from '@firstcoders/service-libs/src/logger';
import audioConvertToM4a from './audioConvertToM4a';
import audioConvertToMp3 from './audioConvertToMp3';
import audioConvertToOggVorbis from './audioConvertToOggVorbis';
import audioConvertToOggOpus from './audioConvertToOggOpus';
import audioConvertToOpusWebm from './audioConvertToOpusWebm';

export default async ({ file, format, ...options }) => {
  try {
    logger.debug('Start converting file', { file, format });

    const output = file.replace(/\.wav/, `.${format}`);

    if (format === 'm4a') await audioConvertToM4a({ file, output, ...options });
    else if (format === 'mp3') await audioConvertToMp3({ file, output, ...options });
    else if (format === 'ogg') await audioConvertToOggVorbis({ file, output, ...options });
    else if (format === 'oga') await audioConvertToOggOpus({ file, output, ...options });
    else if (format === 'webm') await audioConvertToOpusWebm({ file, output, ...options });
    else throw new Error('Invalid format');

    logger.debug('Completed converting file', { file, format });
  } catch (err) {
    logger.error('Failed converting files', { file, format, err });
    throw err;
  }
};
