import is from '@sindresorhus/is';

export default (csv) =>
  csv &&
  csv
    .split(',')
    .map((v) => v.trim())
    .map((val) => (is.number(parseInt(val, 10)) ? parseInt(val, 10) : val));
