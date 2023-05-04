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

export default async ({ file, bitRate, sampleRate, output }) =>
  runFfmpeg([
    '-i',
    file,
    '-c:a',
    'libvorbis',
    '-b:a',
    `${parseInt(bitRate, 10)}k`,
    '-ar',
    sampleRate,
    output,
  ]);
