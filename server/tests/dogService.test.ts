import { describe, it, expect, vi, afterEach } from 'vitest';
import { getRandomDogImage } from '../services/dogService';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getRandomDogImage', () => {
  it('returns dog image data when the API request succeeds', async () => {
    const mockedImageUrl =
      'https://images.dog.ceo/breeds/test/dog.jpg';

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        message: mockedImageUrl,
        status: 'success',
      }),
    } as Response);

    const result = await getRandomDogImage();

    expect(result.imageUrl).toBe(mockedImageUrl);
    expect(result.status).toBe('success');
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('throws an error when the API request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    await expect(getRandomDogImage()).rejects.toThrow(
      'Failed to fetch dog image: Dog API returned status 500'
    );
  });
});
