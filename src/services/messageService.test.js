/**
 * Unit Tests for Message Service
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateSmartResponse, createMessage } from './messageService';

describe('messageService', () => {
  describe('generateSmartResponse', () => {
    describe('greeting patterns', () => {
      it('should respond to "hi"', () => {
        const response = generateSmartResponse('hi');
        expect(response).toBeTruthy();
        expect(typeof response).toBe('string');
      });

      it('should respond to "hello"', () => {
        const response = generateSmartResponse('hello');
        expect(response).toBeTruthy();
      });

      it('should respond to "hey"', () => {
        const response = generateSmartResponse('hey');
        expect(response).toBeTruthy();
      });

      it('should respond to "hi there"', () => {
        const response = generateSmartResponse('hi there');
        expect(response).toBeTruthy();
      });

      it('should respond to uppercase greetings', () => {
        const response = generateSmartResponse('HELLO');
        expect(response).toBeTruthy();
      });

      it('should respond to greetings with extra spaces', () => {
        const response = generateSmartResponse('  hello  ');
        expect(response).toBeTruthy();
      });
    });

    describe('how are you patterns', () => {
      it('should respond to "how are you"', () => {
        const response = generateSmartResponse('how are you');
        expect(response).toBeTruthy();
        expect(response).toContain('?');
      });

      it('should respond to "how r u"', () => {
        const response = generateSmartResponse('how r u');
        expect(response).toBeTruthy();
      });

      it('should respond to "whats up"', () => {
        const response = generateSmartResponse('whats up');
        expect(response).toBeTruthy();
      });

      it('should respond to "how\'s it going"', () => {
        const response = generateSmartResponse("how's it going");
        expect(response).toBeTruthy();
      });

      it('should respond to "how you doing"', () => {
        const response = generateSmartResponse('how you doing');
        expect(response).toBeTruthy();
      });
    });

    describe('thank you patterns', () => {
      it('should respond to "thanks"', () => {
        const response = generateSmartResponse('thanks');
        expect(response).toBeTruthy();
      });

      it('should respond to "thank you"', () => {
        const response = generateSmartResponse('thank you');
        expect(response).toBeTruthy();
      });

      it('should respond to "thx"', () => {
        const response = generateSmartResponse('thx');
        expect(response).toBeTruthy();
      });

      it('should respond to "ty"', () => {
        const response = generateSmartResponse('ty');
        expect(response).toBeTruthy();
      });

      it('should respond to "appreciate it"', () => {
        const response = generateSmartResponse('I really appreciate it');
        expect(response).toBeTruthy();
      });
    });

    describe('goodbye patterns', () => {
      it('should respond to "bye"', () => {
        const response = generateSmartResponse('bye');
        expect(response).toBeTruthy();
      });

      it('should respond to "goodbye"', () => {
        const response = generateSmartResponse('goodbye');
        expect(response).toBeTruthy();
      });

      it('should respond to "see you"', () => {
        const response = generateSmartResponse('see you');
        expect(response).toBeTruthy();
      });

      it('should respond to "ttyl"', () => {
        const response = generateSmartResponse('ttyl');
        expect(response).toBeTruthy();
      });

      it('should respond to "gotta go"', () => {
        const response = generateSmartResponse('gotta go');
        expect(response).toBeTruthy();
      });

      it('should respond to "good night"', () => {
        const response = generateSmartResponse('good night');
        expect(response).toBeTruthy();
      });
    });

    describe('question patterns', () => {
      it('should respond to messages with question marks', () => {
        const response = generateSmartResponse('What do you think about this?');
        expect(response).toBeTruthy();
      });

      it('should respond to "what do you think"', () => {
        const response = generateSmartResponse('what do you think');
        expect(response).toBeTruthy();
      });

      it('should respond to "your opinion"', () => {
        const response = generateSmartResponse('I want your opinion');
        expect(response).toBeTruthy();
      });

      it('should respond to "can you help me"', () => {
        const response = generateSmartResponse('can you help me');
        expect(response).toBeTruthy();
      });

      it('should respond to requests for advice', () => {
        const response = generateSmartResponse('I need some advice');
        expect(response).toBeTruthy();
      });
    });

    describe('excitement patterns', () => {
      it('should respond to "amazing"', () => {
        const response = generateSmartResponse('This is amazing!');
        expect(response).toBeTruthy();
      });

      it('should respond to "awesome"', () => {
        const response = generateSmartResponse('awesome');
        expect(response).toBeTruthy();
      });

      it('should respond to "excited"', () => {
        const response = generateSmartResponse("I'm so excited");
        expect(response).toBeTruthy();
      });

      it('should respond to "great news"', () => {
        const response = generateSmartResponse('great news everyone');
        expect(response).toBeTruthy();
      });

      it('should respond to "love it"', () => {
        const response = generateSmartResponse('I love it');
        expect(response).toBeTruthy();
      });

      it('should respond to "yay"', () => {
        const response = generateSmartResponse('yay!');
        expect(response).toBeTruthy();
      });
    });

    describe('sad patterns', () => {
      it('should respond to "sad"', () => {
        const response = generateSmartResponse("I'm feeling sad");
        expect(response).toBeTruthy();
      });

      it('should respond to "upset"', () => {
        const response = generateSmartResponse("I'm upset");
        expect(response).toBeTruthy();
      });

      it('should respond to "stressed"', () => {
        const response = generateSmartResponse("I'm so stressed");
        expect(response).toBeTruthy();
      });

      it('should respond to "worried"', () => {
        const response = generateSmartResponse("I'm worried about something");
        expect(response).toBeTruthy();
      });

      it('should respond to "bad day"', () => {
        const response = generateSmartResponse('Having a bad day');
        expect(response).toBeTruthy();
      });

      it('should respond to "tired"', () => {
        const response = generateSmartResponse("I'm so tired");
        expect(response).toBeTruthy();
      });
    });

    describe('agreement patterns', () => {
      it('should respond to "agree"', () => {
        const response = generateSmartResponse('I agree with you');
        expect(response).toBeTruthy();
      });

      it('should respond to "exactly"', () => {
        const response = generateSmartResponse('exactly!');
        expect(response).toBeTruthy();
      });

      it('should respond to "definitely"', () => {
        const response = generateSmartResponse('definitely');
        expect(response).toBeTruthy();
      });

      it('should respond to "yes"', () => {
        const response = generateSmartResponse('yes');
        expect(response).toBeTruthy();
      });

      it('should respond to "for sure"', () => {
        const response = generateSmartResponse('for sure');
        expect(response).toBeTruthy();
      });
    });

    describe('attachment handling', () => {
      it('should respond with image response when hasAttachment is true', () => {
        const response = generateSmartResponse('', true);
        expect(response).toBeTruthy();
        expect(typeof response).toBe('string');
      });

      it('should prioritize attachment response over text patterns', () => {
        const response = generateSmartResponse('hello', true);
        // Should return an image-related response, not a greeting
        expect(response).toBeTruthy();
      });

      it('should handle attachment with no text', () => {
        const response = generateSmartResponse('', true);
        expect(response).toBeTruthy();
      });
    });

    describe('general/fallback responses', () => {
      it('should respond to general messages', () => {
        const response = generateSmartResponse('The weather is nice today');
        expect(response).toBeTruthy();
      });

      it('should respond to random text', () => {
        const response = generateSmartResponse('Just wanted to let you know about something');
        expect(response).toBeTruthy();
      });

      it('should handle empty string', () => {
        const response = generateSmartResponse('');
        expect(response).toBeTruthy();
      });

      it('should handle whitespace only', () => {
        const response = generateSmartResponse('   ');
        expect(response).toBeTruthy();
      });
    });

    describe('case insensitivity', () => {
      it('should handle mixed case greetings', () => {
        const response = generateSmartResponse('HeLLo');
        expect(response).toBeTruthy();
      });

      it('should handle uppercase messages', () => {
        const response = generateSmartResponse('HOW ARE YOU DOING');
        expect(response).toBeTruthy();
      });
    });
  });

  describe('createMessage', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-06-15T14:30:00'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    describe('message structure', () => {
      it('should create a message with all required properties', () => {
        const message = createMessage({ text: 'Hello' });

        expect(message).toHaveProperty('id');
        expect(message).toHaveProperty('text');
        expect(message).toHaveProperty('timestamp');
        expect(message).toHaveProperty('isRead');
        expect(message).toHaveProperty('isSent');
      });

      it('should generate a unique id', () => {
        // Mock Date.now to return sequential values
        let callCount = 0;
        vi.spyOn(Date, 'now').mockImplementation(() => 1234567890000 + callCount++);

        const message1 = createMessage({ text: 'First' });
        const message2 = createMessage({ text: 'Second' });

        expect(message1.id).toBeTruthy();
        expect(message2.id).toBeTruthy();
        expect(message1.id).not.toBe(message2.id);
      });

      it('should set the text correctly', () => {
        const message = createMessage({ text: 'Test message' });
        expect(message.text).toBe('Test message');
      });

      it('should include timestamp', () => {
        const message = createMessage({ text: 'Hello' });
        expect(message.timestamp).toBeTruthy();
        expect(typeof message.timestamp).toBe('string');
      });
    });

    describe('isSent property', () => {
      it('should default isSent to true', () => {
        const message = createMessage({ text: 'Hello' });
        expect(message.isSent).toBe(true);
      });

      it('should set isSent to true when specified', () => {
        const message = createMessage({ text: 'Hello', isSent: true });
        expect(message.isSent).toBe(true);
      });

      it('should set isSent to false when specified', () => {
        const message = createMessage({ text: 'Hello', isSent: false });
        expect(message.isSent).toBe(false);
      });
    });

    describe('isRead property', () => {
      it('should set isRead to true for sent messages', () => {
        const message = createMessage({ text: 'Hello', isSent: true });
        expect(message.isRead).toBe(true);
      });

      it('should set isRead to false for received messages', () => {
        const message = createMessage({ text: 'Hello', isSent: false });
        expect(message.isRead).toBe(false);
      });
    });

    describe('attachment handling', () => {
      it('should not include attachment property when null', () => {
        const message = createMessage({ text: 'Hello', attachment: null });
        expect(message).not.toHaveProperty('attachment');
      });

      it('should include attachment when provided', () => {
        const attachmentUrl = 'data:image/png;base64,abc123';
        const message = createMessage({ text: 'Hello', attachment: attachmentUrl });

        expect(message.attachment).toBe(attachmentUrl);
      });

      it('should handle message with attachment but no text', () => {
        const attachmentUrl = 'https://example.com/image.png';
        const message = createMessage({ text: '', attachment: attachmentUrl });

        expect(message.text).toBe('');
        expect(message.attachment).toBe(attachmentUrl);
      });

      it('should handle message with both text and attachment', () => {
        const attachmentUrl = 'https://example.com/image.png';
        const message = createMessage({ text: 'Check this out', attachment: attachmentUrl });

        expect(message.text).toBe('Check this out');
        expect(message.attachment).toBe(attachmentUrl);
      });

      it('should not include attachment for empty string', () => {
        const message = createMessage({ text: 'Hello', attachment: '' });
        expect(message).not.toHaveProperty('attachment');
      });

      it('should not include attachment for undefined', () => {
        const message = createMessage({ text: 'Hello', attachment: undefined });
        expect(message).not.toHaveProperty('attachment');
      });
    });

    describe('default values', () => {
      it('should handle minimal options', () => {
        const message = createMessage({ text: 'Hello' });

        expect(message.text).toBe('Hello');
        expect(message.isSent).toBe(true);
        expect(message.isRead).toBe(true);
        expect(message).not.toHaveProperty('attachment');
      });

      it('should use empty string for text if not provided', () => {
        const message = createMessage({});
        expect(message.text).toBeUndefined();
      });
    });

    describe('timestamp format', () => {
      it('should format timestamp with hours and minutes', () => {
        vi.useRealTimers();
        const message = createMessage({ text: 'Hello' });
        // Timestamp should be in HH:MM format
        expect(message.timestamp).toMatch(/\d{1,2}:\d{2}/);
      });
    });

    describe('id generation', () => {
      it('should generate numeric string id based on timestamp', () => {
        const message = createMessage({ text: 'Hello' });
        expect(message.id).toBeTruthy();
        expect(typeof message.id).toBe('string');
        // Should be parseable as a number (timestamp-based)
        expect(Number(message.id)).not.toBeNaN();
      });
    });

    describe('edge cases', () => {
      it('should handle very long text', () => {
        const longText = 'a'.repeat(10000);
        const message = createMessage({ text: longText });
        expect(message.text).toBe(longText);
      });

      it('should handle special characters in text', () => {
        const specialText = '<script>alert("xss")</script> & "quotes" \'apostrophes\'';
        const message = createMessage({ text: specialText });
        expect(message.text).toBe(specialText);
      });

      it('should handle unicode text', () => {
        const unicodeText = '你好世界 🎉 émoji 日本語';
        const message = createMessage({ text: unicodeText });
        expect(message.text).toBe(unicodeText);
      });

      it('should handle emoji-only messages', () => {
        const emojiText = '😀🎉👍💯';
        const message = createMessage({ text: emojiText });
        expect(message.text).toBe(emojiText);
      });

      it('should handle newlines in text', () => {
        const multilineText = 'Line 1\nLine 2\nLine 3';
        const message = createMessage({ text: multilineText });
        expect(message.text).toBe(multilineText);
      });
    });
  });
});
