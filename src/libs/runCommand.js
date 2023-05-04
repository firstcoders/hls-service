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
import { spawn } from 'child_process';
import { logger } from '@soundws/service-libs';

/**
 * Runs a simple command
 */
export default async (bin, options) =>
  new Promise((resolve, reject) => {
    logger.debug('Start run command', { bin, options });

    const process = spawn(bin, options, {
      // https://stackoverflow.com/questions/35689080/how-to-read-child-process-this.childProcess-stdout-with-stdio-option-inherit
      // stdio: "inherit"
      stdio: 'pipe',
      encoding: 'utf-8',
    });

    process.on('data', (data) => logger.silly(data));

    process.on('error', (err) => {
      logger.error('Failed command', {
        bin,
        options,
        err,
      });
      reject(err);
    });

    process.on('exit', (code) => {
      if (code > 0) {
        logger.error('Failed run command because command exited with non-zero code', {
          bin,
          options,
          code,
        });
        reject(new Error('Failed run command because command exited with non-zero code'));
      } else {
        logger.debug('Completed run command', { bin, options });
        resolve(code);
      }
    });
  });
