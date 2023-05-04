import audioConvertToMp3 from '../../src/libs/audioConvertToMp3';
import runCommand from '../../src/libs/runCommand';

jest.mock('../../src/libs/runCommand');

process.env.LAME_BIN_PATH = '/path/to/lame';

describe('audioConvertToMp3', () => {
  it('runs lame with the correct options', async () => {
    const file = 'file.wav';
    const bitRate = 128;
    const sampleRate = 44100;
    const output = 'output.mp3';

    await audioConvertToMp3({ file, bitRate, sampleRate, output });

    expect(runCommand.mock.calls[0][0]).toBe('/path/to/lame');
    expect(runCommand.mock.calls[0][1]).toStrictEqual([
      'file.wav',
      '-b',
      128,
      '-s',
      44100,
      'output.mp3',
    ]);
  });
});
