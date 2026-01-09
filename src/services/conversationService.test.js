/**
 * Unit Tests for Conversation Service
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createConversation,
  findConversationByUserId,
  findConversationById,
  getOrCreateConversation,
  moveConversationToTop,
  updateConversation,
  addMessageToConversation,
  clearConversationMessages,
  cleanupEmptyConversations,
  removeConversation,
  filterConversations,
  getTotalUnreadCount,
  hasMessages,
  markConversationAsRead,
} from './conversationService';

describe('conversationService', () => {
  describe('createConversation', () => {
    beforeEach(() => {
      vi.spyOn(Date, 'now').mockReturnValue(1234567890123);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should create a conversation with required fields', () => {
      const user = { id: 'user-1', name: 'John Doe' };

      const conversation = createConversation(user);

      expect(conversation.id).toBe('conv-user-1-1234567890123');
      expect(conversation.user).toBe(user);
      expect(conversation.messages).toEqual([]);
      expect(conversation.unreadCount).toBe(0);
      expect(conversation.lastMessage).toBe('');
      expect(conversation.lastMessageTime).toBe('');
    });

    it('should generate unique ids for different conversations', () => {
      vi.restoreAllMocks();

      const user1 = { id: 'user-1', name: 'John' };
      const user2 = { id: 'user-2', name: 'Jane' };

      const conv1 = createConversation(user1);
      const conv2 = createConversation(user2);

      expect(conv1.id).not.toBe(conv2.id);
    });

    it('should include user id in conversation id', () => {
      const user = { id: 'test-user-id', name: 'Test User' };

      const conversation = createConversation(user);

      expect(conversation.id).toContain('test-user-id');
    });
  });

  describe('findConversationByUserId', () => {
    const conversations = [
      { id: 'conv-1', user: { id: 'user-1', name: 'John' } },
      { id: 'conv-2', user: { id: 'user-2', name: 'Jane' } },
      { id: 'conv-3', user: { id: 'user-3', name: 'Bob' } },
    ];

    it('should find conversation by user id', () => {
      const result = findConversationByUserId(conversations, 'user-2');

      expect(result).toBeDefined();
      expect(result.id).toBe('conv-2');
      expect(result.user.name).toBe('Jane');
    });

    it('should return undefined if user not found', () => {
      const result = findConversationByUserId(conversations, 'user-999');

      expect(result).toBeUndefined();
    });

    it('should return undefined for empty array', () => {
      const result = findConversationByUserId([], 'user-1');

      expect(result).toBeUndefined();
    });

    it('should handle null user id', () => {
      const result = findConversationByUserId(conversations, null);

      expect(result).toBeUndefined();
    });
  });

  describe('findConversationById', () => {
    const conversations = [
      { id: 'conv-1', user: { id: 'user-1' } },
      { id: 'conv-2', user: { id: 'user-2' } },
      { id: 'conv-3', user: { id: 'user-3' } },
    ];

    it('should find conversation by id', () => {
      const result = findConversationById(conversations, 'conv-2');

      expect(result).toBeDefined();
      expect(result.id).toBe('conv-2');
    });

    it('should return undefined if conversation not found', () => {
      const result = findConversationById(conversations, 'conv-999');

      expect(result).toBeUndefined();
    });

    it('should return undefined for empty array', () => {
      const result = findConversationById([], 'conv-1');

      expect(result).toBeUndefined();
    });
  });

  describe('getOrCreateConversation', () => {
    beforeEach(() => {
      vi.spyOn(Date, 'now').mockReturnValue(1234567890123);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should return existing conversation if found', () => {
      const conversations = [{ id: 'conv-1', user: { id: 'user-1', name: 'John' } }];
      const user = { id: 'user-1', name: 'John' };

      const result = getOrCreateConversation(conversations, user);

      expect(result.isNew).toBe(false);
      expect(result.conversation.id).toBe('conv-1');
      expect(result.conversations).toBe(conversations);
    });

    it('should create new conversation if not found', () => {
      const conversations = [{ id: 'conv-1', user: { id: 'user-1', name: 'John' } }];
      const user = { id: 'user-2', name: 'Jane' };

      const result = getOrCreateConversation(conversations, user);

      expect(result.isNew).toBe(true);
      expect(result.conversation.user).toBe(user);
      expect(result.conversations.length).toBe(2);
    });

    it('should add new conversation at the beginning', () => {
      const conversations = [{ id: 'conv-1', user: { id: 'user-1', name: 'John' } }];
      const user = { id: 'user-2', name: 'Jane' };

      const result = getOrCreateConversation(conversations, user);

      expect(result.conversations[0]).toBe(result.conversation);
    });

    it('should not mutate original array when creating new conversation', () => {
      const conversations = [{ id: 'conv-1', user: { id: 'user-1', name: 'John' } }];
      const user = { id: 'user-2', name: 'Jane' };

      getOrCreateConversation(conversations, user);

      expect(conversations.length).toBe(1);
    });

    it('should handle empty conversations array', () => {
      const user = { id: 'user-1', name: 'John' };

      const result = getOrCreateConversation([], user);

      expect(result.isNew).toBe(true);
      expect(result.conversations.length).toBe(1);
    });
  });

  describe('moveConversationToTop', () => {
    it('should move conversation to the top', () => {
      const conversations = [{ id: 'conv-1' }, { id: 'conv-2' }, { id: 'conv-3' }];

      const result = moveConversationToTop(conversations, 'conv-3');

      expect(result[0].id).toBe('conv-3');
      expect(result[1].id).toBe('conv-1');
      expect(result[2].id).toBe('conv-2');
    });

    it('should not change order if conversation already at top', () => {
      const conversations = [{ id: 'conv-1' }, { id: 'conv-2' }, { id: 'conv-3' }];

      const result = moveConversationToTop(conversations, 'conv-1');

      expect(result[0].id).toBe('conv-1');
      expect(result[1].id).toBe('conv-2');
      expect(result[2].id).toBe('conv-3');
    });

    it('should return unchanged array if conversation not found', () => {
      const conversations = [{ id: 'conv-1' }, { id: 'conv-2' }];

      const result = moveConversationToTop(conversations, 'conv-999');

      expect(result).toEqual(conversations);
    });

    it('should handle single conversation', () => {
      const conversations = [{ id: 'conv-1' }];

      const result = moveConversationToTop(conversations, 'conv-1');

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('conv-1');
    });

    it('should handle empty array', () => {
      const result = moveConversationToTop([], 'conv-1');

      expect(result).toEqual([]);
    });
  });

  describe('updateConversation', () => {
    it('should update conversation with new data', () => {
      const conversations = [
        { id: 'conv-1', lastMessage: 'Old message' },
        { id: 'conv-2', lastMessage: 'Another message' },
      ];

      const result = updateConversation(conversations, 'conv-1', {
        lastMessage: 'New message',
      });

      expect(result[0].lastMessage).toBe('New message');
      expect(result[1].lastMessage).toBe('Another message');
    });

    it('should preserve existing properties', () => {
      const conversations = [{ id: 'conv-1', lastMessage: 'Old', unreadCount: 5 }];

      const result = updateConversation(conversations, 'conv-1', {
        lastMessage: 'New',
      });

      expect(result[0].unreadCount).toBe(5);
    });

    it('should not mutate original array', () => {
      const conversations = [{ id: 'conv-1', lastMessage: 'Old' }];

      updateConversation(conversations, 'conv-1', {
        lastMessage: 'New',
      });

      expect(conversations[0].lastMessage).toBe('Old');
    });

    it('should not modify other conversations', () => {
      const conversations = [
        { id: 'conv-1', lastMessage: 'Message 1' },
        { id: 'conv-2', lastMessage: 'Message 2' },
      ];

      const result = updateConversation(conversations, 'conv-1', {
        lastMessage: 'Updated',
      });

      expect(result[1].lastMessage).toBe('Message 2');
    });

    it('should handle conversation not found', () => {
      const conversations = [{ id: 'conv-1', lastMessage: 'Old' }];

      const result = updateConversation(conversations, 'conv-999', {
        lastMessage: 'New',
      });

      expect(result).toEqual(conversations);
    });
  });

  describe('addMessageToConversation', () => {
    it('should add message to conversation', () => {
      const conversations = [{ id: 'conv-1', messages: [], unreadCount: 0 }];
      const message = { id: 'msg-1', text: 'Hello', isSent: true };

      const result = addMessageToConversation(conversations, 'conv-1', message);

      expect(result[0].messages.length).toBe(1);
      expect(result[0].messages[0]).toBe(message);
    });

    it('should update lastMessage with message text', () => {
      const conversations = [{ id: 'conv-1', messages: [], lastMessage: '', unreadCount: 0 }];
      const message = { id: 'msg-1', text: 'Hello world', isSent: true };

      const result = addMessageToConversation(conversations, 'conv-1', message);

      expect(result[0].lastMessage).toBe('Hello world');
    });

    it('should use "Sent an attachment" for messages without text', () => {
      const conversations = [{ id: 'conv-1', messages: [], lastMessage: '', unreadCount: 0 }];
      const message = { id: 'msg-1', text: '', isSent: true, attachment: 'image.jpg' };

      const result = addMessageToConversation(conversations, 'conv-1', message);

      expect(result[0].lastMessage).toBe('Sent an attachment');
    });

    it('should set lastMessageTime to "Just now"', () => {
      const conversations = [{ id: 'conv-1', messages: [], lastMessageTime: '', unreadCount: 0 }];
      const message = { id: 'msg-1', text: 'Hello', isSent: true };

      const result = addMessageToConversation(conversations, 'conv-1', message);

      expect(result[0].lastMessageTime).toBe('Just now');
    });

    it('should not increment unread count for sent messages', () => {
      const conversations = [{ id: 'conv-1', messages: [], unreadCount: 0 }];
      const message = { id: 'msg-1', text: 'Hello', isSent: true };

      const result = addMessageToConversation(conversations, 'conv-1', message);

      expect(result[0].unreadCount).toBe(0);
    });

    it('should not increment unread count when viewing conversation', () => {
      const conversations = [{ id: 'conv-1', messages: [], unreadCount: 0 }];
      const message = { id: 'msg-1', text: 'Hello', isSent: false };

      const result = addMessageToConversation(conversations, 'conv-1', message, true);

      expect(result[0].unreadCount).toBe(0);
    });

    it('should increment unread count for received messages when not viewing', () => {
      const conversations = [{ id: 'conv-1', messages: [], unreadCount: 0 }];
      const message = { id: 'msg-1', text: 'Hello', isSent: false };

      const result = addMessageToConversation(conversations, 'conv-1', message, false);

      expect(result[0].unreadCount).toBe(1);
    });

    it('should preserve existing messages', () => {
      const existingMessage = { id: 'msg-1', text: 'First' };
      const conversations = [{ id: 'conv-1', messages: [existingMessage], unreadCount: 0 }];
      const newMessage = { id: 'msg-2', text: 'Second', isSent: true };

      const result = addMessageToConversation(conversations, 'conv-1', newMessage);

      expect(result[0].messages.length).toBe(2);
      expect(result[0].messages[0]).toBe(existingMessage);
    });

    it('should not mutate original array', () => {
      const conversations = [{ id: 'conv-1', messages: [], unreadCount: 0 }];
      const message = { id: 'msg-1', text: 'Hello', isSent: true };

      addMessageToConversation(conversations, 'conv-1', message);

      expect(conversations[0].messages.length).toBe(0);
    });
  });

  describe('clearConversationMessages', () => {
    it('should clear all messages from conversation', () => {
      const conversations = [
        {
          id: 'conv-1',
          messages: [{ id: 'msg-1' }, { id: 'msg-2' }],
          lastMessage: 'Hello',
          lastMessageTime: '10:00 AM',
          unreadCount: 2,
        },
      ];

      const result = clearConversationMessages(conversations, 'conv-1');

      expect(result[0].messages).toEqual([]);
      expect(result[0].lastMessage).toBe('No messages yet');
      expect(result[0].lastMessageTime).toBe('');
      expect(result[0].unreadCount).toBe(0);
    });

    it('should not affect other conversations', () => {
      const conversations = [
        { id: 'conv-1', messages: [{ id: 'msg-1' }], lastMessage: 'Hello' },
        { id: 'conv-2', messages: [{ id: 'msg-2' }], lastMessage: 'World' },
      ];

      const result = clearConversationMessages(conversations, 'conv-1');

      expect(result[1].messages.length).toBe(1);
      expect(result[1].lastMessage).toBe('World');
    });

    it('should not mutate original array', () => {
      const conversations = [{ id: 'conv-1', messages: [{ id: 'msg-1' }] }];

      clearConversationMessages(conversations, 'conv-1');

      expect(conversations[0].messages.length).toBe(1);
    });

    it('should handle conversation not found', () => {
      const conversations = [{ id: 'conv-1', messages: [{ id: 'msg-1' }] }];

      const result = clearConversationMessages(conversations, 'conv-999');

      expect(result).toEqual(conversations);
    });
  });

  describe('cleanupEmptyConversations', () => {
    it('should remove conversations with no messages', () => {
      const conversations = [
        { id: 'conv-1', messages: [{ id: 'msg-1' }] },
        { id: 'conv-2', messages: [] },
        { id: 'conv-3', messages: [{ id: 'msg-2' }] },
      ];

      const result = cleanupEmptyConversations(conversations);

      expect(result.length).toBe(2);
      expect(result.find((c) => c.id === 'conv-2')).toBeUndefined();
    });

    it('should keep all conversations if none are empty', () => {
      const conversations = [
        { id: 'conv-1', messages: [{ id: 'msg-1' }] },
        { id: 'conv-2', messages: [{ id: 'msg-2' }] },
      ];

      const result = cleanupEmptyConversations(conversations);

      expect(result.length).toBe(2);
    });

    it('should return empty array if all conversations are empty', () => {
      const conversations = [
        { id: 'conv-1', messages: [] },
        { id: 'conv-2', messages: [] },
      ];

      const result = cleanupEmptyConversations(conversations);

      expect(result).toEqual([]);
    });

    it('should handle empty input array', () => {
      const result = cleanupEmptyConversations([]);

      expect(result).toEqual([]);
    });

    it('should not mutate original array', () => {
      const conversations = [
        { id: 'conv-1', messages: [] },
        { id: 'conv-2', messages: [{ id: 'msg-1' }] },
      ];

      cleanupEmptyConversations(conversations);

      expect(conversations.length).toBe(2);
    });
  });

  describe('removeConversation', () => {
    it('should remove conversation by id', () => {
      const conversations = [{ id: 'conv-1' }, { id: 'conv-2' }, { id: 'conv-3' }];

      const result = removeConversation(conversations, 'conv-2');

      expect(result.length).toBe(2);
      expect(result.find((c) => c.id === 'conv-2')).toBeUndefined();
    });

    it('should return unchanged array if conversation not found', () => {
      const conversations = [{ id: 'conv-1' }, { id: 'conv-2' }];

      const result = removeConversation(conversations, 'conv-999');

      expect(result.length).toBe(2);
    });

    it('should not mutate original array', () => {
      const conversations = [{ id: 'conv-1' }, { id: 'conv-2' }];

      removeConversation(conversations, 'conv-1');

      expect(conversations.length).toBe(2);
    });

    it('should handle removing last conversation', () => {
      const conversations = [{ id: 'conv-1' }];

      const result = removeConversation(conversations, 'conv-1');

      expect(result).toEqual([]);
    });
  });

  describe('filterConversations', () => {
    const conversations = [
      { id: 'conv-1', user: { name: 'John Doe' }, lastMessage: 'Hello there' },
      { id: 'conv-2', user: { name: 'Jane Smith' }, lastMessage: 'How are you' },
      { id: 'conv-3', user: { name: 'Bob Johnson' }, lastMessage: 'Meeting tomorrow' },
    ];

    it('should filter by user name', () => {
      const result = filterConversations(conversations, 'John');

      expect(result.length).toBe(2); // John Doe and Bob Johnson
    });

    it('should filter by last message', () => {
      const result = filterConversations(conversations, 'tomorrow');

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('conv-3');
    });

    it('should be case insensitive', () => {
      const result = filterConversations(conversations, 'JOHN');

      expect(result.length).toBe(2);
    });

    it('should return all conversations for empty query', () => {
      const result = filterConversations(conversations, '');

      expect(result).toEqual(conversations);
    });

    it('should return all conversations for whitespace query', () => {
      const result = filterConversations(conversations, '   ');

      expect(result).toEqual(conversations);
    });

    it('should return empty array if no matches', () => {
      const result = filterConversations(conversations, 'xyz123');

      expect(result).toEqual([]);
    });

    it('should handle empty conversations array', () => {
      const result = filterConversations([], 'test');

      expect(result).toEqual([]);
    });
  });

  describe('getTotalUnreadCount', () => {
    it('should sum all unread counts', () => {
      const conversations = [
        { id: 'conv-1', unreadCount: 3 },
        { id: 'conv-2', unreadCount: 5 },
        { id: 'conv-3', unreadCount: 2 },
      ];

      const result = getTotalUnreadCount(conversations);

      expect(result).toBe(10);
    });

    it('should return 0 for empty array', () => {
      const result = getTotalUnreadCount([]);

      expect(result).toBe(0);
    });

    it('should return 0 if all counts are 0', () => {
      const conversations = [
        { id: 'conv-1', unreadCount: 0 },
        { id: 'conv-2', unreadCount: 0 },
      ];

      const result = getTotalUnreadCount(conversations);

      expect(result).toBe(0);
    });

    it('should handle single conversation', () => {
      const conversations = [{ id: 'conv-1', unreadCount: 7 }];

      const result = getTotalUnreadCount(conversations);

      expect(result).toBe(7);
    });
  });

  describe('hasMessages', () => {
    it('should return true if conversation has messages', () => {
      const conversation = { messages: [{ id: 'msg-1' }] };

      expect(hasMessages(conversation)).toBe(true);
    });

    it('should return false if conversation has no messages', () => {
      const conversation = { messages: [] };

      expect(hasMessages(conversation)).toBe(false);
    });

    it('should return false for null conversation', () => {
      expect(hasMessages(null)).toBe(false);
    });

    it('should return false for undefined conversation', () => {
      expect(hasMessages(undefined)).toBe(false);
    });

    it('should return false if messages property is missing', () => {
      const conversation = {};

      expect(hasMessages(conversation)).toBe(false);
    });

    it('should return true for multiple messages', () => {
      const conversation = {
        messages: [{ id: 'msg-1' }, { id: 'msg-2' }, { id: 'msg-3' }],
      };

      expect(hasMessages(conversation)).toBe(true);
    });
  });

  describe('markConversationAsRead', () => {
    it('should reset unread count to 0', () => {
      const conversations = [{ id: 'conv-1', unreadCount: 5, messages: [] }];

      const result = markConversationAsRead(conversations, 'conv-1');

      expect(result[0].unreadCount).toBe(0);
    });

    it('should mark all messages as read', () => {
      const conversations = [
        {
          id: 'conv-1',
          unreadCount: 2,
          messages: [
            { id: 'msg-1', isRead: false },
            { id: 'msg-2', isRead: false },
            { id: 'msg-3', isRead: true },
          ],
        },
      ];

      const result = markConversationAsRead(conversations, 'conv-1');

      expect(result[0].messages.every((m) => m.isRead)).toBe(true);
    });

    it('should not affect other conversations', () => {
      const conversations = [
        {
          id: 'conv-1',
          unreadCount: 3,
          messages: [{ id: 'msg-1', isRead: false }],
        },
        {
          id: 'conv-2',
          unreadCount: 5,
          messages: [{ id: 'msg-2', isRead: false }],
        },
      ];

      const result = markConversationAsRead(conversations, 'conv-1');

      expect(result[1].unreadCount).toBe(5);
      expect(result[1].messages[0].isRead).toBe(false);
    });

    it('should not mutate original array', () => {
      const conversations = [
        {
          id: 'conv-1',
          unreadCount: 3,
          messages: [{ id: 'msg-1', isRead: false }],
        },
      ];

      markConversationAsRead(conversations, 'conv-1');

      expect(conversations[0].unreadCount).toBe(3);
      expect(conversations[0].messages[0].isRead).toBe(false);
    });

    it('should handle conversation not found', () => {
      const conversations = [{ id: 'conv-1', unreadCount: 3, messages: [] }];

      const result = markConversationAsRead(conversations, 'conv-999');

      expect(result).toEqual(conversations);
    });

    it('should handle conversation with no messages', () => {
      const conversations = [{ id: 'conv-1', unreadCount: 0, messages: [] }];

      const result = markConversationAsRead(conversations, 'conv-1');

      expect(result[0].messages).toEqual([]);
      expect(result[0].unreadCount).toBe(0);
    });
  });
});
