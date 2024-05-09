import { renderHook, act } from '@testing-library/react';
import axios from 'axios';
import { describe, it, expect, vi } from 'vitest';
import { useGetImage } from '../hooks/useGetImage';
import { getAddress } from '../utils/serverAddress';

vi.mock('axios');

describe('useGetImage', () => {
  it('should fetch image successfully', async () => {
    const imageAddress = 'test-image.jpg';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (axios as any).mockResolvedValueOnce({
      data: {},
      status: 200,
    });

    const { result } = renderHook(() => useGetImage(imageAddress));

    await act(async () => {
      result.current.fetchImage();
    });
    expect(result.current.imageSrc).toBe(getAddress(imageAddress));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle failed image fetch', async () => {
    const imageAddress = 'test-image.jpg';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (axios as any).mockRejectedValueOnce(new Error('Failed to fetch image'));

    const { result } = renderHook(() => useGetImage(imageAddress));

    await act(async () => {
      result.current.fetchImage();
    });

    expect(result.current.imageSrc).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Failed to fetch image');
  });
});


