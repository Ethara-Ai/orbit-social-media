/**
 * Message Service
 * Handles message-related business logic including smart response generation
 *
 * Note: Conversation-related functions are in conversationService.js
 */

// Greeting patterns and responses
const GREETING_PATTERNS = [
  'hi',
  'hello',
  'hey',
  'hola',
  'howdy',
  'sup',
  'yo',
  'hii',
  'hiii',
  'heya',
  'hi there',
  'hello there',
];

const GREETING_RESPONSES = [
  "Hey! How's it going? 😊",
  'Hi there! Great to hear from you!',
  "Hello! What's up?",
  "Hey! Hope you're having a great day!",
  'Hi! Nice to chat with you!',
  'Hey there! How are you doing?',
  "Hello! How's everything?",
  "Hi! What's on your mind today?",
];

// How are you patterns and responses
const HOW_ARE_YOU_PATTERNS = [
  'how are you',
  'how r u',
  "how're you",
  'hows it going',
  "how's it going",
  'whats up',
  "what's up",
  'wassup',
  'how you doing',
  'how are things',
];

const HOW_ARE_YOU_RESPONSES = [
  "I'm doing great, thanks for asking! How about you?",
  'Pretty good! Just been busy with some projects. You?',
  'Doing well! What about yourself?',
  "Can't complain! How's your day going?",
  "I'm good! Thanks for asking. What's new with you?",
  'Feeling fantastic today! How are things on your end?',
  'All good here! What brings you to chat?',
];

// Thank you patterns and responses
const THANK_YOU_PATTERNS = ['thank', 'thanks', 'thx', 'ty', 'appreciate'];

const THANK_YOU_RESPONSES = [
  "You're welcome! 😊",
  'No problem at all!',
  'Anytime! Happy to help!',
  'Of course! Let me know if you need anything else.',
  "You're so welcome!",
  'My pleasure!',
  'Glad I could help!',
  "Don't mention it! 🙌",
];

// Goodbye patterns and responses
const GOODBYE_PATTERNS = [
  'bye',
  'goodbye',
  'see you',
  'gotta go',
  'gtg',
  'talk later',
  'ttyl',
  'cya',
  'see ya',
  'later',
  'good night',
  'goodnight',
];

const GOODBYE_RESPONSES = [
  'Catch you later! 👋',
  'See you soon! Take care!',
  'Bye! Have a great day!',
  'Talk to you later! 😊',
  "Take care! Don't be a stranger!",
  'Until next time! 🙌',
  'Goodbye! Stay awesome!',
];

// Question patterns and responses
const QUESTION_PATTERNS = [
  'what do you think',
  'your opinion',
  'do you like',
  'what about',
  'how about',
  'thoughts on',
  'advice',
  'help me',
  'can you',
];

const QUESTION_RESPONSES = [
  "That's an interesting question! Let me think about it...",
  "Great question! I'd say it depends on the situation.",
  'Hmm, I think there are multiple perspectives to consider here.',
  "I'd be happy to share my thoughts! What specifically would you like to know?",
  "That's something I've been thinking about too!",
  "Good question! Let's discuss it further.",
];

// Excitement patterns and responses
const EXCITEMENT_PATTERNS = [
  'amazing',
  'awesome',
  'incredible',
  'fantastic',
  'wonderful',
  'great news',
  'excited',
  "can't wait",
  'so happy',
  'love it',
  'best',
  'perfect',
  'yay',
  'woohoo',
];

const EXCITEMENT_RESPONSES = [
  "That's awesome! I'm excited for you! 🎉",
  'So happy to hear that! Tell me more!',
  'Amazing! This is great news! 🙌',
  'Wonderful! I love your enthusiasm!',
  "That's fantastic! You deserve it!",
  "Woohoo! Let's celebrate! 🎊",
  'I can feel your excitement! So cool!',
];

// Sad patterns and responses
const SAD_PATTERNS = [
  'sad',
  'upset',
  'disappointed',
  'frustrated',
  'annoyed',
  'tired',
  'exhausted',
  'stressed',
  'worried',
  'anxious',
  'not good',
  'bad day',
  'rough',
];

const SAD_RESPONSES = [
  "I'm sorry to hear that. Want to talk about it?",
  "That sounds tough. I'm here if you need to vent.",
  'Sending you good vibes! Things will get better 💪',
  "I understand. Take your time, I'm here for you.",
  "That's rough. Remember, it's okay to not be okay sometimes.",
  "I hear you. Let me know if there's anything I can do to help.",
];

// Agreement patterns and responses
const AGREEMENT_PATTERNS = [
  'agree',
  'exactly',
  'right',
  'true',
  'correct',
  'yes',
  'yeah',
  'yep',
  'definitely',
  'absolutely',
  'for sure',
];

const AGREEMENT_RESPONSES = [
  "Glad we're on the same page! 🤝",
  'Great minds think alike!',
  'Exactly what I was thinking!',
  "Couldn't agree more!",
  'Yes! You get it!',
  'Right? It just makes sense!',
];

// Image/attachment responses
const IMAGE_RESPONSES = [
  'Wow, thanks for sharing! That looks amazing! 📸',
  'Cool picture! I love it!',
  "That's a great shot! Thanks for sending!",
  'Nice! I appreciate you sharing this with me!',
  'Awesome! This made my day! 😊',
  'Love it! Keep sharing these gems!',
  'Great share! You have a good eye!',
  'Thanks for the visual! Really cool stuff!',
];

// General fallback responses
const GENERAL_RESPONSES = [
  "That's interesting! Tell me more.",
  'I see! What made you think of that?',
  "Cool! I'd love to hear more about it.",
  'Interesting point! What else is on your mind?',
  'Thanks for sharing! How did that come about?',
  'Nice! Keep me posted on how things go!',
  "Got it! Anything else you'd like to chat about?",
  'I appreciate you sharing that with me!',
  "That's something to think about!",
];

/**
 * Pick a random item from an array
 * @param {Array} arr - Array to pick from
 * @returns {*} Random item from array
 */
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Check if text matches any pattern in the array
 * @param {string} text - Text to check
 * @param {string[]} patterns - Patterns to match against
 * @returns {boolean} Whether text matches any pattern
 */
const matchesPattern = (text, patterns) => {
  return patterns.some((pattern) => text.includes(pattern));
};

/**
 * Generate a smart response based on message content
 * @param {string} messageText - The message text to analyze
 * @param {boolean} hasAttachment - Whether the message has an attachment
 * @returns {string} Generated response
 */
export const generateSmartResponse = (messageText, hasAttachment = false) => {
  const text = messageText.toLowerCase().trim();

  // If there's an attachment, prioritize image responses
  if (hasAttachment) {
    return pickRandom(IMAGE_RESPONSES);
  }

  // Check for greetings
  if (GREETING_PATTERNS.some((greeting) => text === greeting || text.startsWith(greeting + ' '))) {
    return pickRandom(GREETING_RESPONSES);
  }

  // Check for "how are you" patterns
  if (matchesPattern(text, HOW_ARE_YOU_PATTERNS)) {
    return pickRandom(HOW_ARE_YOU_RESPONSES);
  }

  // Check for thank you patterns
  if (matchesPattern(text, THANK_YOU_PATTERNS)) {
    return pickRandom(THANK_YOU_RESPONSES);
  }

  // Check for goodbye patterns
  if (matchesPattern(text, GOODBYE_PATTERNS)) {
    return pickRandom(GOODBYE_RESPONSES);
  }

  // Check for questions
  if (matchesPattern(text, QUESTION_PATTERNS) || text.includes('?')) {
    return pickRandom(QUESTION_RESPONSES);
  }

  // Check for excitement
  if (matchesPattern(text, EXCITEMENT_PATTERNS)) {
    return pickRandom(EXCITEMENT_RESPONSES);
  }

  // Check for sad/negative emotions
  if (matchesPattern(text, SAD_PATTERNS)) {
    return pickRandom(SAD_RESPONSES);
  }

  // Check for agreement
  if (matchesPattern(text, AGREEMENT_PATTERNS)) {
    return pickRandom(AGREEMENT_RESPONSES);
  }

  // Default to general response
  return pickRandom(GENERAL_RESPONSES);
};

/**
 * Create a new message object
 * @param {Object} options - Message options
 * @param {string} options.text - Message text
 * @param {boolean} options.isSent - Whether message is sent by current user
 * @param {string|null} options.attachment - Optional attachment URL
 * @returns {Object} New message object
 */
export const createMessage = ({ text, isSent = true, attachment = null, attachments = [] }) => {
  // Handle backward compatibility and priority
  const finalAttachments = attachments.length > 0 ? attachments : attachment ? [attachment] : [];
  const primaryAttachment = attachment || (finalAttachments.length > 0 ? finalAttachments[0] : null);

  return {
    id: Date.now().toString(),
    text,
    timestamp: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    isRead: isSent,
    isSent,
    ...(primaryAttachment && { attachment: primaryAttachment }),
    ...(finalAttachments.length > 0 && { attachments: finalAttachments }),
  };
};

export default {
  generateSmartResponse,
  createMessage,
};
