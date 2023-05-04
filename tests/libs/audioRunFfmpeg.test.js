import audioRunFfmpeg from '../../src/libs/audioRunFfmpeg';
import runCommand from '../../src/libs/runCommand';

jest.mock('../../src/libs/runCommand');

process.env.FFMPEG_BIN_PATH = '/path/to/ffmpeg';

describe('audioRunFfmpeg', () => {
  it('returns the command with options', async () => {
    await audioRunFfmpeg(['-a', 'someoption']);

    expect(runCommand.mock.calls[0][0]).toBe('/path/to/ffmpeg');
    expect(runCommand.mock.calls[0][1]).toStrictEqual(['-a', 'someoption']);
  });
});
