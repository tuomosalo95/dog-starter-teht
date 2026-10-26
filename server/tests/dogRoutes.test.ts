import { describe, it, expect, vi, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import dogRoutes from '../routes/dogRoutes';
import { getRandomDogImage } from '../services/dogService';

vi.mock('../services/dogService', () => ({
  getRandomDogImage: vi.fn(),
}));

const app = express();
app.use('/api/dogs', dogRoutes);

afterEach(() => {
  vi.clearAllMocks();
});

describe('GET /api/dogs/random', () => {
  it('returns a dog image when the service succeeds', async () => {
    vi.mocked(getRandomDogImage).mockResolvedValue({
      imageUrl: 'https://images.dog.ceo/breeds/test/dog.jpg',
      status: 'success',
    });

    const response = await request(app).get('/api/dogs/random');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        imageUrl: 'https://images.dog.ceo/breeds/test/dog.jpg',
        status: 'success',
      },
    });
  });

  it('returns HTTP 500 when the service fails', async () => {
    vi.mocked(getRandomDogImage).mockRejectedValue(
      new Error('Dog API unavailable')
    );

    const response = await request(app).get('/api/dogs/random');

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('Dog API unavailable');
  });
});
