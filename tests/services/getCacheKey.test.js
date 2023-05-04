import { getEtag } from '@soundws/service-libs';
import getCacheKey from '../../src/services/getCacheKey';

jest.mock('@soundws/service-libs');

describe('getCacheKey', () => {
  it('segments the file into wav, then from wav into mp3s and deletes the wav', async () => {
    getEtag.mockResolvedValue('myetag');

    const cacheKey = await getCacheKey('https://get-it-here.com/drums.wav');

    expect(cacheKey).toBe('4bd94cefeb40433a438e6da4df9f27be');
  });
});
