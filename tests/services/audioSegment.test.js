import fs from 'fs';
import { resolve } from 'path';
import audioSegment from '../../src/services/audioSegment';
import getTmpFolder from '../../src/libs/getTmpFolder';
import audioSegmentToWav from '../../src/libs/audioSegmentToWav';
import audioConvertWavToFormat from '../../src/libs/audioConvertWavToFormat';

jest.mock('@firstcoders/service-libs/src/logger');
jest.mock('../../src/libs/getTmpFolder');
jest.mock('../../src/libs/runCommand');
jest.mock('../../src/libs/audioSegmentToWav');
jest.mock('../../src/libs/audioConvertWavToFormat');

process.env.LAME_BIN_PATH = '/path/to/lame';
process.env.FFMPEG_BIN_PATH = '/path/to/ffmpeg';

const options = {
  file: 'file.wav',
  bitRate: 123,
  sampleRate: 44100,
  format: 'mp3',
  folderPrefix: 'abcde/fg',
};

const fixturesFolder = resolve(__dirname, '..', 'fixtures');
const tmpFolder = resolve(__dirname, '..', '.tmp');

describe('audioSegment', () => {
  beforeEach(() => {
    getTmpFolder.mockResolvedValue(tmpFolder);

    fs.mkdirSync(tmpFolder);

    // mock the implementation of the initial segmentation of a file
    audioSegmentToWav.mockImplementation(() => {
      fs.copyFileSync(resolve(fixturesFolder, 'index.m3u8'), resolve(tmpFolder, 'index.m3u8'));
      fs.copyFileSync(
        resolve(fixturesFolder, 'segment-000.wav'),
        resolve(tmpFolder, 'segment-000.wav'),
      );
    });

    // mock the conversion of a wav file to a target format file
    audioConvertWavToFormat.mockImplementation(() => {
      fs.copyFileSync(resolve(tmpFolder, 'segment-000.wav'), resolve(tmpFolder, 'segment-000.mp3'));
    });
  });

  afterEach(() => {
    fs.rmdirSync(tmpFolder, { recursive: true, force: true });
  });

  describe('when #format is mp3', () => {
    it('segments the file into wav, then from wav into mp3s and deletes the wav', async () => {
      await audioSegment(options);
      expect(fs.readdirSync(resolve(tmpFolder))).toEqual(['index.m3u8', 'segment-000.mp3']);
    });

    it('updates the path and file extension in the M3U8 index file', async () => {
      await audioSegment(options);

      const contents = fs.readFileSync(resolve(tmpFolder, 'index.m3u8'), {
        encoding: 'utf8',
      });

      expect(/abcde\/fg\/segment-000\.wav/.test(contents)).toBe(false);
      expect(/abcde\/fg\/segment-000\.mp3/.test(contents)).toBe(true);
    });
  });
});
