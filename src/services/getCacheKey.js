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
import { createHash } from 'crypto';

export default ({ sourceUrl, format, segmentTime, bitRate, sampleRate }) => {
  const { hostname, pathname } = new URL(sourceUrl);

  return createHash('md5')
    .update(`${hostname}:${pathname}:${format}:${segmentTime}:${bitRate}:${sampleRate}`)
    .digest('hex');
};
