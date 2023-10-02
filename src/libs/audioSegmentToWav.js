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
import runFfmpeg from './audioRunFfmpeg';

/**
 * Segments a source file into WAV segments. It does some rechunking of the to ensure a consistent frame size.
 * This helps to ensure that eventual playback works nicely with respect to gapless playback using the Web-Audio API.
 */
export default ({
  sourceUrl,
  segmentTime,
  sampleRate,
  tmpWorkspaceFolder,
  audioOutputMaxDuration,
}) =>
  runFfmpeg([
    '-i',
    sourceUrl,
    '-f',
    'segment',
    ...(audioOutputMaxDuration ? ['-t', audioOutputMaxDuration] : []),
    '-ar',
    sampleRate,
    '-bsf',
    'pcm_rechunk=r=30000/100',
    '-acodec',
    'pcm_s24le',
    '-segment_time',
    segmentTime,
    '-segment_list',
    `${tmpWorkspaceFolder}/index.m3u8`,
    '-segment_format',
    'wav',
    `${tmpWorkspaceFolder}/segment-%03d.wav`,
    '-segment_time_delta',
    '0',
  ]);
