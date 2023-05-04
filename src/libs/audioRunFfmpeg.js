import runCommand from './runCommand';

export default async (options, bin = process.env.FFMPEG_BIN_PATH) => runCommand(bin, options);
