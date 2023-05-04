import runLame from './audioRunLame';

// We use lame, as ffmpeg doesnt include the XING tag (i.e. gapless information)
// Check with eyeD3 -P lameinfo fileencodedwithlame.mp3
export default async ({ file, bitRate, sampleRate, output }) =>
  runLame([file, '-b', bitRate, '-s', sampleRate, output]);
