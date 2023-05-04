import config from '../config';

export default (cacheKey, { sampleRate, bitRate, segmentTime, format }) =>
  `${config.s3FolderPrefix}/${cacheKey}/${format}/${segmentTime}s/${bitRate}kb/${sampleRate}hz`;
