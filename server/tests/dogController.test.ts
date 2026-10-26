import { describe, it, expect, vi, afterEach } from 'vitest';
import type { Response } from 'express';
import { getDogImage } from '../controllers/dogController';
import { getRandomDogImage } from '../services/dogService';

vi.mock('../services/dogService', () => ({
  getRandomDogImage: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe('getDogImage', () => {
  it('returns dog image data when the service succeeds', async () => {
    const dogData = {
      imageUrl: 'https://images.dog.ceo/breeds/test/dog.jpg',
      status: 'success',
    };

    vi.mocked(getRandomDogImage).mockResolvedValue(dogData);

    const res = {
      json: vi.fn(),
      status: vi.fn(),
    };

    res.status.mockReturnValue(res as unknown as Response);

    await getDogImage({} as never, res as unknown as Response);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: dogData,
    });
    expect(res.status).not.toHaveBeenCalled();
  });
});
