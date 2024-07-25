import generateUrlForObject from './generateUrlForObject';
import config from '../config';

export default async (m3u8) => {
  // fetch keys from m3u8
  const objects = m3u8.match(
    new RegExp(
      `${
        config.s3FolderPrefix
        // eslint-disable-next-line no-useless-escape
      }\/[a-f0-9]{32}/segment-[0-9]+\.[a-z0-9]+`,
      'gs',
    ),
  );

  // create a signed url for each object
  const map = await Promise.all(
    objects.map((object) =>
      generateUrlForObject(object, {
        expiresIn: config.signedUrlExpiresIn,
      }).then((url) => ({
        object,
        url,
      })),
    ),
  );

  // replace each object with the signed url
  let body = m3u8;
  map.forEach(({ object, url }) => {
    body = body.replace(object, url);
  });

  return body;
};
