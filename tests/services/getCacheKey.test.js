import getCacheKey from '../../src/services/getCacheKey';

jest.mock('@firstcoders/service-libs');

describe('getCacheKey', () => {
  it('segments the file into wav, then from wav into mp3s and deletes the wav', async () => {
    const cacheKey = getCacheKey({ sourceUrl: 'https://get-it-here.com/drums.wav' });

    expect(cacheKey).toBe('df5f6b08c193ea08d853221a8e5a4bd7');
  });
});
