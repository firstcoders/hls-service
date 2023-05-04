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
import { readdir, readFile, writeFile, unlink } from 'fs/promises';
import { resolve } from 'path';
import { logger } from '@soundws/service-libs';
import convertWavToFormat from '../libs/audioConvertWavToFormat';
import audioSegmentToWav from '../libs/audioSegmentToWav';
import getTmpFolder from '../libs/getTmpFolder';

export default async (options) => {
  try {
    const tmpWorkspaceFolder = await getTmpFolder();

    logger.debug('Start processing audio', {
      options,
      tmpWorkspaceFolder,
    });

    // 1 first we simply segment the wavs without converting to the target format
    await audioSegmentToWav({ tmpWorkspaceFolder, ...options });

    // Get the wavs that have been generated
    const files = (await readdir(tmpWorkspaceFolder))
      .filter((file) => file.indexOf('.wav') !== -1)
      .map((file) => resolve(tmpWorkspaceFolder, file));

    // 2 then we convert the wavs to the target format
    await Promise.all(files.map((file) => convertWavToFormat({ file, ...options })));

    // 3 delete the WAV files, which we dont need anymore
    await Promise.all(files.map((file) => unlink(file)));

    // 4 change the extensions in the generated m3u8 file

    // first read the file
    const indexFile = resolve(tmpWorkspaceFolder, 'index.m3u8');

    // and get it's contents
    const contents = await readFile(indexFile, {
      encoding: 'utf8',
    });

    // change the file extensions
    const updatedContents = contents.replace(
      /(segment-\d+)(\.wav)/g,
      `${options.folderPrefix}/$1.${options.format}`
    );

    // write the file back to disk
    await writeFile(indexFile, updatedContents);

    logger.debug('Completed processing audio', {
      options,
      tmpWorkspaceFolder,
      m3u8FileContents: updatedContents,
    });

    return { path: tmpWorkspaceFolder, m3u8FileContents: updatedContents };
  } catch (err) {
    logger.error('Failed processing audio', {
      options,
      err,
    });

    throw err;
  }
};
