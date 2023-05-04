import runFfmpeg from './audioRunFfmpeg';

/**
 * Segments a source file into WAV segments. It does some rechunking of the to ensure a consistent frame size.
 * This helps to ensure that eventual playback works nicely with respect to gapless playback using the Web-Audio API.
 */
export default ({ sourceUrl, segmentTime, sampleRate, tmpWorkspaceFolder }) =>
  runFfmpeg([
    '-i',
    sourceUrl,
    '-f',
    'segment',
    '-ar',
    sampleRate,
    '-bsf',
    'pcm_rechunk=r=30000/100',
    '-acodec',
    'pcm_s24le',
    '-segment_time',
    segmentTime,
    '-segment_list',
    `${tmpWorkspaceFolder}/index.m3u8`,
    '-segment_format',
    'wav',
    `${tmpWorkspaceFolder}/segment-%03d.wav`,
    '-segment_time_delta',
    '0',
  ]);
