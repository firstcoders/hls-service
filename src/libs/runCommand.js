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
