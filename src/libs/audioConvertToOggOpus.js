import runFfmpeg from './audioRunFfmpeg';

export default async ({ file, bitRate, sampleRate, output }) =>
  runFfmpeg([
    '-i',
    file,
    '-c:a',
    'libopus',
    '-b:a',
    `${parseInt(bitRate, 10)}k`,
    '-ar',
    sampleRate,
    output,
  ]);
