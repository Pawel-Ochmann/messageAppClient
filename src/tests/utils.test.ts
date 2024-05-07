import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useState } from 'react';
import { formatTime } from '../utils/formatTime';
import { createNewGroup } from '../utils/createNewGroup';
import { Socket } from 'socket.io-client';
import { ConversationType, User } from '../types';
import {
  getLastMessageContent,
  getLastMessageDate,
} from '../utils/getLastMessageInfo';
import { getAddress } from '../utils/serverAddress';
import updateConversation from '../utils/updateConversations';
import { updateLastRead } from '../utils/lastRead';
import { sortContacts } from '../utils/sortContacts';
import { getConversationName } from '../utils/getConversationName';

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
    expect(mockConsoleError);
  });
});

describe('getLastMessageContent', () => {
  it('returns empty string if conversation has no messages', () => {
    const conversation = { messages: [] };
    const result = getLastMessageContent(
      conversation as unknown as ConversationType
    );
    expect(result).toEqual('');
  });

  it('returns truncated text message content if length exceeds maxLength', () => {
    const conversation = {
      messages: [{ type: 'text', content: 'This is a long message content' }],
    };
    const result = getLastMessageContent(
      conversation as unknown as ConversationType
    );
    expect(result).toEqual('This is a ...');
  });

  it('returns full text message content if length does not exceed maxLength', () => {
    const conversation = {
      messages: [{ type: 'text', content: 'Short mess' }],
    };
    const result = getLastMessageContent(
      conversation as unknown as ConversationType
    );
    expect(result).toEqual('Short mess');
  });

  it('returns "GIF" for GIF message type', () => {
    const conversation = { messages: [{ type: 'gif' }] };
    const result = getLastMessageContent(
      conversation as unknown as ConversationType
    );
    expect(result).toEqual('GIF');
  });

  it('returns "Image" for image message type', () => {
    const conversation = { messages: [{ type: 'image' }] };
    const result = getLastMessageContent(
      conversation as unknown as ConversationType
    );
    expect(result).toEqual('Image');
  });

  it('returns "Audio" for audio message type', () => {
    const conversation = { messages: [{ type: 'audio' }] };
    const result = getLastMessageContent(
      conversation as unknown as ConversationType
    );
    expect(result).toEqual('Audio');
  });

  it('returns empty string for unknown message type', () => {
    const conversation = { messages: [{ type: 'unknown' }] };
    const result = getLastMessageContent(
      conversation as unknown as ConversationType
    );
    expect(result).toEqual('');
  });
});

describe('getLastMessageDate', () => {
  it('returns empty string if conversation has no messages', () => {
    const conversation = { messages: [] } as unknown as ConversationType;
    const result = getLastMessageDate(conversation);
    expect(result).toEqual('');
  });

  it('returns the correct date in "from now" format for the last message', () => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const conversation = {
      messages: [{ date: yesterday }],
    } as ConversationType;

    const result = getLastMessageDate(conversation);
    const expected = 'a day ago'; // The expected output based on the behavior of `moment` library
    expect(result).toEqual(expected);
  });
});

describe('getAddress', () => {
  const address = 'https://message-application.fly.dev';

  it('returns the correct address when directory is provided', () => {
    const directory = 'images/';
    const result = getAddress(directory);
    expect(result).toEqual(`${address}${directory}`);
  });

  it('returns the correct address when directory is empty', () => {
    const directory = '';
    const result = getAddress(directory);
    expect(result).toEqual(address);
  });

  it('returns the correct address when directory contains special characters', () => {
    const directory = 'special characters !@#$%^&*()';
    const result = getAddress(directory);
    expect(result).toEqual(`${address}${directory}`);
  });

  it('returns the correct address when directory contains spaces', () => {
    const directory = 'directory with spaces';
    const result = getAddress(directory);
    expect(result).toEqual(`${address}${directory}`);
  });
});

vi.mock('../utils/lastRead', () => ({
  updateLastRead: vi.fn(),
}));

describe('updateConversation', () => {
  const initialUserState: User = {
    name: '',
    password: '',
    _id: '',
    lastVisited: new Date(),
    conversations: [
      {
        key: '1',
        messages: [],
        participants: [],
        group: false,
        name: [],
      },
    ],
    groupConversations: [],
  };


  const { result } = renderHook(() => {
    const [user, setUser] = useState<User>(initialUserState);
    return { user, setUser };
  });

  const setChatOpenMock = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('does not update chatOpen or call updateLastRead when chatOpen does not match updated conversation', () => {

    const updatedConversation = {
      key: '1',
      messages: [],
      participants: [],
      group: false,
      name: [],
    };

    const chatOpen = {
      key: '2',
      messages: [],
      participants: [],
      group: false,
      name: [],
    };

    updateConversation(
      result.current.setUser,
      updatedConversation,
      chatOpen,
      setChatOpenMock
    );
    expect(setChatOpenMock).not.toHaveBeenCalled();
    expect(updateLastRead).not.toHaveBeenCalled();
  });
});


const conversations: ConversationType[] = [
  {
    key: '1',
    participants: [],
    group: false,
    name: [],
    messages: [
      {
        date: new Date('2024-05-06T12:00:00Z'),
        author: '',
        content: '',
        type: 'text',
        _id: '',
      },
      {
        date: new Date('2024-05-07T12:00:00Z'),
        author: '',
        content: '',
        type: 'text',
        _id: '',
      },
    ],
  },
  {
    key: '2',
    participants: [],
    group: false,
    name: [],
    messages: [
      {
        date: new Date('2024-05-05T12:00:00Z'),
        author: '',
        content: '',
        type: 'text',
        _id: '',
      },
    ],
  },
  {
    key: '3',
    participants: [],
    group: false,
    name: [],
    messages: [],
  },
];

describe('sortContacts', () => {
  it('should sort conversations based on the last message date', () => {
    const sortedConversations = sortContacts(conversations);
    expect(sortedConversations[0].key).toEqual('1');
    expect(sortedConversations[1].key).toEqual('2');
    expect(sortedConversations[2].key).toEqual('3');
  });
});

describe('getConversationName', () => {
  it('should return the conversation name if it has only one name', () => {
    const user = { _id: '1', name: 'John' } as User;
    const conversation = {
      _id: '1',
      name: ['Conversation Name'],
    } as unknown as ConversationType;
    const result = getConversationName(user, conversation);
    expect(result).toEqual('Conversation Name');
  });

  it("should return the other participant's name if there are multiple names", () => {
    const user = { _id: '1', name: 'John' } as User;
    const conversation = { id: '1', name: ['John', 'Alice'] } as unknown as ConversationType;
    const result = getConversationName(user, conversation);
    expect(result).toEqual('Alice');
  });
});