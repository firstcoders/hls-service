import runCommand from '../../src/libs/runCommand';

jest.mock('@firstcoders/service-libs/src/logger');

describe('runCommand', () => {
  describe('when a command succeeds', () => {
    it('returns 0 as a status code', async () => {
      const output = await runCommand('ls');
      expect(output).toBe(0);
    });
  });

  describe('when a command fails', () => {
    it('throws an error', async () => {
      let thrownError;

      try {
        await runCommand('doesnotexists');
      } catch (err) {
        thrownError = err;
      }

      expect(thrownError.code).toBe('ENOENT');
    });
  });
});
