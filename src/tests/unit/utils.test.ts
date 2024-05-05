import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { formatTime } from '../../utils/formatTime';
import { createNewGroup } from '../../utils/createNewGroup';
import { Socket } from 'socket.io-client';
import { ConversationType } from '../../types';

describe('formatTime function', () => {
  it('formats time correctly for minutes and seconds less than 10', () => {
    const time = formatTime(65);
    expect(time).toBe('01:05');
  });

  it('formats time correctly for minutes and seconds greater than 10', () => {
    const time = formatTime(123);
    expect(time).toBe('02:03');
  });

  it('formats time correctly for minutes greater than 10', () => {
    const time = formatTime(723);
    expect(time).toBe('12:03');
  });

  it('formats time correctly for seconds greater than 10', () => {
    const time = formatTime(55);
    expect(time).toBe('00:55');
  });

  it('formats time correctly for 0 seconds', () => {
    const time = formatTime(0);
    expect(time).toBe('00:00');
  });
});

const mockSocket = {
  emit: vi.fn(),
};

describe('createNewGroup function', () => {
  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).socket = mockSocket;
  });
  afterEach(() => {
    mockSocket.emit.mockClear();
  });

  it('creates new conversation without group image', async () => {
    const newConversation = {};
    await createNewGroup({
      socket: mockSocket as unknown as Socket,
      newConversation: newConversation as ConversationType,
      groupImage: null,
    });
    expect(mockSocket.emit).toHaveBeenCalledWith(
      'createNewConversation',
      newConversation,
      expect.any(Function)
    );
  });

  it('handles error if new chat creation confirmation fails', async () => {
    mockSocket.emit.mockImplementation((event, data, callback) => {
      if (event === 'createNewConversation') {
        callback(false);
      }
    });
    const newConversation = {
    };
    const groupImage = new File(['group-image'], 'group-image.png', {
      type: 'image/png',
    });
    const mockConsoleError = vi.spyOn(console, 'error');
    await createNewGroup({
      socket: mockSocket as unknown as Socket,
      newConversation: newConversation as ConversationType,
      groupImage,
    });
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error: New chat creation confirmation failed'
    );
  });

  it('handles error if group image could not be set', async () => {
    mockSocket.emit.mockImplementation((event, data, callback) => {
      if (event === 'createNewConversation') {
        callback(true);
      } else if (event === 'setGroupImage') {
        callback(false);
      }
    });
    const newConversation = {};
    const groupImage = new File(['group-image'], 'group-image.png', {
      type: 'image/png',
    });
    const mockConsoleError = vi.spyOn(console, 'error');
    await createNewGroup({
      socket: mockSocket as unknown as Socket,
      newConversation: newConversation as ConversationType,
      groupImage,
    });
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error: Group image could not be set'
    );
  });
});
