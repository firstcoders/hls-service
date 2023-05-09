import getCacheKey from '../../src/services/getCacheKey';

jest.mock('@soundws/service-libs');

describe('getCacheKey', () => {
  it('segments the file into wav, then from wav into mp3s and deletes the wav', async () => {
    const cacheKey = getCacheKey('https://get-it-here.com/drums.wav');

    expect(cacheKey).toBe('e7d1fb8c97c6afa862f1c238e0424f6a');
  });
});
