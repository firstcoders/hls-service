import audioSegmentToWav from '../../src/libs/audioSegmentToWav';
import runCommand from '../../src/libs/runCommand';

jest.mock('../../src/libs/runCommand');

process.env.FFMPEG_BIN_PATH = '/path/to/ffmpeg';

describe('audioConvertToMp3', () => {
  it('runs lame with the correct options', async () => {
    const sourceUrl = 'file.wav';
    const sampleRate = 44100;
    const segmentTime = 10;
    const tmpWorkspaceFolder = '/tmp/put/it/here';

    await audioSegmentToWav({ sourceUrl, segmentTime, sampleRate, tmpWorkspaceFolder });

    expect(runCommand.mock.calls[0][0]).toBe('/path/to/ffmpeg');
    expect(runCommand.mock.calls[0][1]).toStrictEqual([
      '-i',
      'file.wav',
      '-f',
      'segment',
      '-ar',
      44100,
      '-bsf',
      'pcm_rechunk=r=30000/100',
      '-acodec',
      'pcm_s24le',
      '-segment_time',
      10,
      '-segment_list',
      '/tmp/put/it/here/index.m3u8',
      '-segment_format',
      'wav',
      '/tmp/put/it/here/segment-%03d.wav',
      '-segment_time_delta',
      '0',
    ]);
  });
});
