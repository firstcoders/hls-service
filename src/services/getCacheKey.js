import { createHash } from 'crypto';
import { getEtag } from '@soundws/service-libs';

export default async (sourceUrl) => {
  const etag = await getEtag(sourceUrl);
  const { hostname, pathname } = new URL(sourceUrl);
  return createHash('md5').update(`${hostname}:${pathname}:${etag}`).digest('hex');
};
