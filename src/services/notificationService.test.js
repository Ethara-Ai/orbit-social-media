/**
 * Unit Tests for Notification Service
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  NOTIFICATION_TYPES,
  generateConnectionNotification,
  generateFriendRequestNotification,
  generateRandomNotification,
  markAllAsRead,
  markAsRead,
  countUnread,
  addNotification,
  getNotificationIconConfig,
} from './notificationService';

describe('notificationService', () => {
  describe('NOTIFICATION_TYPES', () => {
    it('should have LIKE type', () => {
      expect(NOTIFICATION_TYPES.LIKE).toBe('like');
    });

    it('should have COMMENT type', () => {
      expect(NOTIFICATION_TYPES.COMMENT).toBe('comment');
    });

    it('should have FOLLOW type', () => {
      expect(NOTIFICATION_TYPES.FOLLOW).toBe('follow');
    });

    it('should have MENTION type', () => {
      expect(NOTIFICATION_TYPES.MENTION).toBe('mention');
    });

    it('should have FRIEND_REQUEST type', () => {
      expect(NOTIFICATION_TYPES.FRIEND_REQUEST).toBe('friend_request');
    });

    it('should have exactly 5 notification types', () => {
      expect(Object.keys(NOTIFICATION_TYPES).length).toBe(5);
    });
  });

  describe('generateConnectionNotification', () => {
    beforeEach(() => {
      vi.spyOn(Date, 'now').mockReturnValue(1234567890123);
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should create a notification with required properties', () => {
      const user = { id: '1', name: 'John Doe', avatar: 'avatar.jpg' };
      const notification = generateConnectionNotification(user);

      expect(notification).toHaveProperty('id');
      expect(notification).toHaveProperty('type');
      expect(notification).toHaveProperty('user');
      expect(notification).toHaveProperty('message');
      expect(notification).toHaveProperty('timestamp');
      expect(notification).toHaveProperty('isRead');
      expect(notification).toHaveProperty('isConnection');
    });

    it('should set the user correctly', () => {
      const user = { id: '1', name: 'John Doe', avatar: 'avatar.jpg' };
      const notification = generateConnectionNotification(user);

      expect(notification.user).toBe(user);
    });

    it('should set timestamp to "now"', () => {
      const user = { id: '1', name: 'John Doe' };
      const notification = generateConnectionNotification(user);

      expect(notification.timestamp).toBe('Just now');
    });

    it('should set isRead to false', () => {
      const user = { id: '1', name: 'John Doe' };
      const notification = generateConnectionNotification(user);

      expect(notification.isRead).toBe(false);
    });

    it('should set isConnection to true', () => {
      const user = { id: '1', name: 'John Doe' };
      const notification = generateConnectionNotification(user);

      expect(notification.isConnection).toBe(true);
    });

    it('should generate unique ids', () => {
      // Mock Date.now to return sequential values
      let callCount = 0;
      vi.spyOn(Date, 'now').mockImplementation(() => 1234567890000 + callCount++);

      const user = { id: '1', name: 'John Doe' };
      const notification1 = generateConnectionNotification(user);
      const notification2 = generateConnectionNotification(user);

      expect(notification1.id).not.toBe(notification2.id);
    });

    it('should have a valid notification type', () => {
      vi.restoreAllMocks();
      const user = { id: '1', name: 'John Doe' };
      const notification = generateConnectionNotification(user);

      const validTypes = [
        NOTIFICATION_TYPES.LIKE,
        NOTIFICATION_TYPES.COMMENT,
        NOTIFICATION_TYPES.FOLLOW,
        NOTIFICATION_TYPES.MENTION,
      ];
      expect(validTypes).toContain(notification.type);
    });

    it('should have a message string', () => {
      const user = { id: '1', name: 'John Doe' };
      const notification = generateConnectionNotification(user);

      expect(typeof notification.message).toBe('string');
      expect(notification.message.length).toBeGreaterThan(0);
    });
  });

  describe('generateFriendRequestNotification', () => {
    beforeEach(() => {
      vi.spyOn(Date, 'now').mockReturnValue(1234567890123);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should create a notification with required properties', () => {
      const user = { id: '1', name: 'Jane Doe', avatar: 'avatar.jpg' };
      const notification = generateFriendRequestNotification(user);

      expect(notification).toHaveProperty('id');
      expect(notification).toHaveProperty('type');
      expect(notification).toHaveProperty('user');
      expect(notification).toHaveProperty('message');
      expect(notification).toHaveProperty('timestamp');
      expect(notification).toHaveProperty('isRead');
      expect(notification).toHaveProperty('isConnection');
    });

    it('should set type to FRIEND_REQUEST', () => {
      const user = { id: '1', name: 'Jane Doe' };
      const notification = generateFriendRequestNotification(user);

      expect(notification.type).toBe(NOTIFICATION_TYPES.FRIEND_REQUEST);
    });

    it('should set the user correctly', () => {
      const user = { id: '1', name: 'Jane Doe', avatar: 'avatar.jpg' };
      const notification = generateFriendRequestNotification(user);

      expect(notification.user).toBe(user);
    });

    it('should set message to connection request text', () => {
      const user = { id: '1', name: 'Jane Doe' };
      const notification = generateFriendRequestNotification(user);

      expect(notification.message).toBe('sent you a connection request');
    });

    it('should set timestamp to "now"', () => {
      const user = { id: '1', name: 'John Doe' };
      const notification = generateFriendRequestNotification(user);

      expect(notification.timestamp).toBe('Just now');
    });

    it('should set isRead to false', () => {
      const user = { id: '1', name: 'Jane Doe' };
      const notification = generateFriendRequestNotification(user);

      expect(notification.isRead).toBe(false);
    });

    it('should set isConnection to false', () => {
      const user = { id: '1', name: 'Jane Doe' };
      const notification = generateFriendRequestNotification(user);

      expect(notification.isConnection).toBe(false);
    });

    it('should generate id based on timestamp', () => {
      const user = { id: '1', name: 'Jane Doe' };
      const notification = generateFriendRequestNotification(user);

      expect(notification.id).toBe('1234567890123');
    });
  });

  describe('generateRandomNotification', () => {
    const friends = [
      { id: '1', name: 'Friend 1' },
      { id: '2', name: 'Friend 2' },
    ];
    const suggestedUsers = [
      { id: '3', name: 'Suggested 1' },
      { id: '4', name: 'Suggested 2' },
    ];

    beforeEach(() => {
      vi.spyOn(Date, 'now').mockReturnValue(1234567890123);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should generate friend request when random < friendRequestChance', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.1);
      const notification = generateRandomNotification(friends, suggestedUsers, 0.3);

      expect(notification.type).toBe(NOTIFICATION_TYPES.FRIEND_REQUEST);
      expect(notification.isConnection).toBe(false);
    });

    it('should generate connection notification when random >= friendRequestChance', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const notification = generateRandomNotification(friends, suggestedUsers, 0.3);

      expect(notification.type).not.toBe(NOTIFICATION_TYPES.FRIEND_REQUEST);
      expect(notification.isConnection).toBe(true);
    });

    it('should use default friendRequestChance of 0.3', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.1);
      const notification = generateRandomNotification(friends, suggestedUsers);

      expect(notification.type).toBe(NOTIFICATION_TYPES.FRIEND_REQUEST);
    });

    it('should return connection notification when suggestedUsers is empty', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.1);
      const notification = generateRandomNotification(friends, [], 0.3);

      expect(notification.isConnection).toBe(true);
    });

    it('should return null when both lists are empty', () => {
      const notification = generateRandomNotification([], []);

      expect(notification).toBeNull();
    });

    it('should return null when friends is empty and random >= friendRequestChance', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const notification = generateRandomNotification([], suggestedUsers, 0.3);

      expect(notification).toBeNull();
    });

    it('should select a random user from friends for connection notification', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const notification = generateRandomNotification(friends, suggestedUsers, 0.3);

      expect(friends).toContainEqual(notification.user);
    });

    it('should select a random user from suggestedUsers for friend request', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.1);
      const notification = generateRandomNotification(friends, suggestedUsers, 0.3);

      expect(suggestedUsers).toContainEqual(notification.user);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', () => {
      const notifications = [
        { id: '1', message: 'Notification 1', isRead: false },
        { id: '2', message: 'Notification 2', isRead: false },
        { id: '3', message: 'Notification 3', isRead: true },
      ];

      const result = markAllAsRead(notifications);

      expect(result.every((n) => n.isRead === true)).toBe(true);
    });

    it('should not mutate original array', () => {
      const notifications = [
        { id: '1', message: 'Notification 1', isRead: false },
        { id: '2', message: 'Notification 2', isRead: false },
      ];

      markAllAsRead(notifications);

      expect(notifications[0].isRead).toBe(false);
      expect(notifications[1].isRead).toBe(false);
    });

    it('should preserve other notification properties', () => {
      const notifications = [
        { id: '1', message: 'Test', type: 'like', user: { name: 'John' }, isRead: false },
      ];

      const result = markAllAsRead(notifications);

      expect(result[0].id).toBe('1');
      expect(result[0].message).toBe('Test');
      expect(result[0].type).toBe('like');
      expect(result[0].user).toEqual({ name: 'John' });
    });

    it('should return empty array for empty input', () => {
      const result = markAllAsRead([]);
      expect(result).toEqual([]);
    });

    it('should handle single notification', () => {
      const notifications = [{ id: '1', isRead: false }];

      const result = markAllAsRead(notifications);

      expect(result.length).toBe(1);
      expect(result[0].isRead).toBe(true);
    });
  });

  describe('markAsRead', () => {
    it('should mark specific notification as read', () => {
      const notifications = [
        { id: '1', isRead: false },
        { id: '2', isRead: false },
        { id: '3', isRead: false },
      ];

      const result = markAsRead(notifications, '2');

      expect(result[0].isRead).toBe(false);
      expect(result[1].isRead).toBe(true);
      expect(result[2].isRead).toBe(false);
    });

    it('should not mutate original array', () => {
      const notifications = [
        { id: '1', isRead: false },
        { id: '2', isRead: false },
      ];

      markAsRead(notifications, '1');

      expect(notifications[0].isRead).toBe(false);
    });

    it('should preserve other notification properties', () => {
      const notifications = [{ id: '1', message: 'Test', type: 'like', isRead: false }];

      const result = markAsRead(notifications, '1');

      expect(result[0].message).toBe('Test');
      expect(result[0].type).toBe('like');
    });

    it('should return unchanged array if notification not found', () => {
      const notifications = [
        { id: '1', isRead: false },
        { id: '2', isRead: false },
      ];

      const result = markAsRead(notifications, '999');

      expect(result[0].isRead).toBe(false);
      expect(result[1].isRead).toBe(false);
    });

    it('should handle empty array', () => {
      const result = markAsRead([], '1');
      expect(result).toEqual([]);
    });

    it('should not affect already read notifications', () => {
      const notifications = [{ id: '1', isRead: true }];

      const result = markAsRead(notifications, '1');

      expect(result[0].isRead).toBe(true);
    });
  });

  describe('countUnread', () => {
    it('should count unread notifications', () => {
      const notifications = [
        { id: '1', isRead: false },
        { id: '2', isRead: true },
        { id: '3', isRead: false },
        { id: '4', isRead: false },
      ];

      const count = countUnread(notifications);

      expect(count).toBe(3);
    });

    it('should return 0 for empty array', () => {
      const count = countUnread([]);
      expect(count).toBe(0);
    });

    it('should return 0 when all are read', () => {
      const notifications = [
        { id: '1', isRead: true },
        { id: '2', isRead: true },
      ];

      const count = countUnread(notifications);

      expect(count).toBe(0);
    });

    it('should count all when none are read', () => {
      const notifications = [
        { id: '1', isRead: false },
        { id: '2', isRead: false },
        { id: '3', isRead: false },
      ];

      const count = countUnread(notifications);

      expect(count).toBe(3);
    });

    it('should handle single unread notification', () => {
      const notifications = [{ id: '1', isRead: false }];

      const count = countUnread(notifications);

      expect(count).toBe(1);
    });

    it('should handle single read notification', () => {
      const notifications = [{ id: '1', isRead: true }];

      const count = countUnread(notifications);

      expect(count).toBe(0);
    });
  });

  describe('addNotification', () => {
    it('should add notification at the beginning', () => {
      const notifications = [
        { id: '1', message: 'Old' },
        { id: '2', message: 'Older' },
      ];
      const newNotification = { id: '3', message: 'New' };

      const result = addNotification(notifications, newNotification);

      expect(result[0]).toBe(newNotification);
      expect(result.length).toBe(3);
    });

    it('should not mutate original array', () => {
      const notifications = [{ id: '1', message: 'Old' }];
      const newNotification = { id: '2', message: 'New' };

      addNotification(notifications, newNotification);

      expect(notifications.length).toBe(1);
    });

    it('should respect maxNotifications limit', () => {
      const notifications = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }];
      const newNotification = { id: '6' };

      const result = addNotification(notifications, newNotification, 5);

      expect(result.length).toBe(5);
      expect(result[0].id).toBe('6');
      expect(result[4].id).toBe('4');
    });

    it('should default maxNotifications to 20', () => {
      const notifications = Array.from({ length: 25 }, (_, i) => ({ id: `${i}` }));
      const newNotification = { id: 'new' };

      const result = addNotification(notifications, newNotification);

      expect(result.length).toBe(20);
      expect(result[0].id).toBe('new');
    });

    it('should work with empty array', () => {
      const newNotification = { id: '1', message: 'First' };

      const result = addNotification([], newNotification);

      expect(result.length).toBe(1);
      expect(result[0]).toBe(newNotification);
    });

    it('should handle maxNotifications of 1', () => {
      const notifications = [{ id: '1' }, { id: '2' }];
      const newNotification = { id: '3' };

      const result = addNotification(notifications, newNotification, 1);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('3');
    });

    it('should preserve notification objects', () => {
      const existingNotification = {
        id: '1',
        message: 'Test',
        type: 'like',
        user: { name: 'John' },
      };
      const notifications = [existingNotification];
      const newNotification = { id: '2', message: 'New' };

      const result = addNotification(notifications, newNotification);

      expect(result[1]).toEqual(existingNotification);
    });
  });

  describe('getNotificationIconConfig', () => {
    it('should return config for LIKE type', () => {
      const config = getNotificationIconConfig(NOTIFICATION_TYPES.LIKE);

      expect(config.iconName).toBe('Heart');
      expect(config.iconColor).toBe('text-rose-500');
      expect(config.bgClass).toBe('bg-rose-50');
    });

    it('should return config for COMMENT type', () => {
      const config = getNotificationIconConfig(NOTIFICATION_TYPES.COMMENT);

      expect(config.iconName).toBe('MessageCircle');
      expect(config.iconColor).toBe('text-blue-500');
      expect(config.bgClass).toBe('bg-blue-50');
    });

    it('should return config for FOLLOW type', () => {
      const config = getNotificationIconConfig(NOTIFICATION_TYPES.FOLLOW);

      expect(config.iconName).toBe('UserPlus');
      expect(config.iconColor).toBe('text-emerald-500');
      expect(config.bgClass).toBe('bg-emerald-50');
    });

    it('should return config for MENTION type', () => {
      const config = getNotificationIconConfig(NOTIFICATION_TYPES.MENTION);

      expect(config.iconName).toBe('User');
      expect(config.iconColor).toBe('text-orange-500');
      expect(config.bgClass).toBe('bg-orange-50');
    });

    it('should return config for FRIEND_REQUEST type', () => {
      const config = getNotificationIconConfig(NOTIFICATION_TYPES.FRIEND_REQUEST);

      expect(config.iconName).toBe('Users');
      expect(config.iconColor).toBe('text-purple-500');
      expect(config.bgClass).toBe('bg-purple-50');
    });

    it('should return default config for unknown type', () => {
      const config = getNotificationIconConfig('unknown_type');

      expect(config.iconName).toBe('Bell');
      expect(config.iconColor).toBe('text-slate-400');
      expect(config.bgClass).toBe('bg-slate-50');
    });

    it('should return default config for null type', () => {
      const config = getNotificationIconConfig(null);

      expect(config.iconName).toBe('Bell');
      expect(config.iconColor).toBe('text-slate-400');
      expect(config.bgClass).toBe('bg-slate-50');
    });

    it('should return default config for undefined type', () => {
      const config = getNotificationIconConfig(undefined);

      expect(config.iconName).toBe('Bell');
      expect(config.iconColor).toBe('text-slate-400');
      expect(config.bgClass).toBe('bg-slate-50');
    });

    it('should return object with all required properties', () => {
      const config = getNotificationIconConfig(NOTIFICATION_TYPES.LIKE);

      expect(config).toHaveProperty('iconName');
      expect(config).toHaveProperty('iconColor');
      expect(config).toHaveProperty('bgClass');
      expect(Object.keys(config).length).toBe(3);
    });
  });
});
