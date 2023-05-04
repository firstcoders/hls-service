import { resolve } from 'path';
import { v4 as createUuid } from 'uuid';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

/**
 * Creates a unique tmp folder
 *
 * @param {Object} params
 * @param {String} params.basedir - the basedir to use to create the tmp folder
 */
export default async ({ basedir = '/tmp' } = {}) => {
  const tmpWorkspaceFolder = resolve(basedir, createUuid());
  if (!existsSync(tmpWorkspaceFolder)) await mkdir(tmpWorkspaceFolder, { recursive: true });
  return tmpWorkspaceFolder;
};
