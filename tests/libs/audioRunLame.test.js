import audioRunLame from '../../src/libs/audioRunLame';
import runCommand from '../../src/libs/runCommand';

jest.mock('../../src/libs/runCommand');

process.env.LAME_BIN_PATH = '/path/to/lame';

describe('audioRunLame', () => {
  it('returns the command with options', async () => {
    await audioRunLame(['-a', 'someoption']);

    expect(runCommand.mock.calls[0][0]).toBe('/path/to/lame');
    expect(runCommand.mock.calls[0][1]).toStrictEqual(['-a', 'someoption']);
  });
});
