import { rmdirSync } from 'fs';
import getTmpFolder from '../../src/libs/getTmpFolder';

describe('getTmpFolder', () => {
  it('creates a tmp folder with a unique name', async () => {
    const tmpFolder = await getTmpFolder();

    expect(tmpFolder).toMatch(
      /\/tmp\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/
    );

    rmdirSync(tmpFolder);
  });

  it('uses a different basedir when told', async () => {
    const tmpFolder = await getTmpFolder({ basedir: '/tmp/somewhereelse' });

    expect(tmpFolder).toMatch(
      /\/tmp\/somewhereelse\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/
    );

    rmdirSync(tmpFolder);
  });
});
