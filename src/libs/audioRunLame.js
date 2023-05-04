import runCommand from './runCommand';

export default async (options, bin = process.env.LAME_BIN_PATH) => runCommand(bin, options);
