import audioConvertWavToFormat from '../../src/libs/audioConvertWavToFormat';
import runCommand from '../../src/libs/runCommand';

jest.mock('@soundws/service-libs/src/logger');
jest.mock('../../src/libs/runCommand');

process.env.LAME_BIN_PATH = '/path/to/lame';
process.env.FFMPEG_BIN_PATH = '/path/to/ffmpeg';

const options = {
  file: 'file.wav',
  bitRate: 123,
  sampleRate: 44100,
  format: 'mp3',
};

describe('audioConvertToMp3', () => {
  describe('when format is not supported', () => {
    it('throws an error if format is not supported', async () => {
      let thrownError;

      try {
        await audioConvertWavToFormat({ options, format: 'somethingelseentirely' });
      } catch (err) {
        thrownError = err;
      }

      expect(thrownError).toBeInstanceOf(Error);
    });
  });

  describe('when format is mp3', () => {
    it('runs lame with the correct options', async () => {
      await audioConvertWavToFormat(options);

      expect(runCommand.mock.calls[0][0]).toBe('/path/to/lame');
      expect(runCommand.mock.calls[0][1]).toStrictEqual([
        'file.wav',
        '-b',
        123,
        '-s',
        44100,
        'file.mp3',
      ]);
    });
  });

  describe('when format is ogg', () => {
    it('runs ffmpeg with the correct options', async () => {
      await audioConvertWavToFormat({ ...options, format: 'ogg' });

      expect(runCommand.mock.calls[0][0]).toBe('/path/to/ffmpeg');
      expect(runCommand.mock.calls[0][1]).toStrictEqual([
        '-i',
        'file.wav',
        '-c:a',
        'libvorbis',
        '-b:a',
        '123k',
        '-ar',
        44100,
        'file.ogg',
      ]);
    });
  });

  describe('when format is m4a', () => {
    it('runs ffmpeg with the correct options', async () => {
      await audioConvertWavToFormat({ ...options, format: 'm4a' });

      expect(runCommand.mock.calls[0][0]).toBe('/path/to/ffmpeg');
      expect(runCommand.mock.calls[0][1]).toStrictEqual([
        '-i',
        'file.wav',
        '-c:a',
        'aac',
        '-b:a',
        '123k',
        '-ar',
        44100,
        'file.m4a',
      ]);
    });
  });

  describe('when format is oga', () => {
    it('runs ffmpeg with the correct options', async () => {
      await audioConvertWavToFormat({ ...options, format: 'oga' });

      expect(runCommand.mock.calls[0][0]).toBe('/path/to/ffmpeg');
      expect(runCommand.mock.calls[0][1]).toStrictEqual([
        '-i',
        'file.wav',
        '-c:a',
        'libopus',
        '-b:a',
        '123k',
        '-ar',
        44100,
        'file.oga',
      ]);
    });
  });
});
