import { logger } from '@soundws/service-libs';
import audioConvertToM4a from './audioConvertToM4a';
import audioConvertToMp3 from './audioConvertToMp3';
import audioConvertToOggVorbis from './audioConvertToOggVorbis';
import audioConvertToOggOpus from './audioConvertToOggOpus';

export default async ({ file, format, ...options }) => {
  try {
    logger.debug('Start converting file', { file, format });

    const output = file.replace(/\.wav/, `.${format}`);

    if (format === 'm4a') await audioConvertToM4a({ file, output, ...options });
    else if (format === 'mp3') await audioConvertToMp3({ file, output, ...options });
    else if (format === 'ogg') await audioConvertToOggVorbis({ file, output, ...options });
    else if (format === 'oga') await audioConvertToOggOpus({ file, output, ...options });
    else throw new Error('Invalid format');

    logger.debug('Completed converting file', { file, format });
  } catch (err) {
    logger.error('Failed converting files', { file, format, err });
    throw err;
  }
};
