// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { BORDER_RADIUS } from '../../../utils/constants';
import { linkifyText } from '../../../utils/stringUtils';

const MessageBubble = ({ message }) => {
  const { text, timestamp, isSent, attachment } = message;
  const hasOnlyAttachment = attachment && !text;

  return (
    <motion.div
      className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`max-w-[75%] ${BORDER_RADIUS.cardLarge} overflow-hidden transition-colors ${
          isSent
            ? 'bg-orange-500 text-white rounded-br-md'
            : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-xs rounded-bl-md'
        } ${hasOnlyAttachment ? 'p-1' : attachment ? 'pb-2' : 'px-4 py-2.5'}`}
      >
        {attachment && <MessageAttachment src={attachment} isSent={isSent} hasText={!!text} />}
        {text && (
          <p className={`text-sm ${attachment ? 'px-3 pt-1.5' : ''}`}>
            {linkifyText(text).map((part) => {
              if (part.type === 'link') {
                return (
                  <a
                    key={part.key}
                    href={part.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`underline transition-colors ${
                      isSent
                        ? 'text-white hover:text-orange-50'
                        : 'text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {part.content}
                  </a>
                );
              }
              return <span key={part.key}>{part.content}</span>;
            })}
          </p>
        )}
        <MessageTimestamp
          timestamp={timestamp}
          isSent={isSent}
          hasAttachment={!!attachment}
          hasText={!!text}
        />
      </div>
    </motion.div>
  );
};

const MessageAttachment = ({ src, hasText }) => {
  const handleImageError = (e) => {
    e.target.src =
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop';
  };

  return (
    <div className={hasText ? 'mb-1' : ''}>
      <img
        src={src}
        alt="Attachment"
        className={`w-full max-w-xs h-auto object-cover ${BORDER_RADIUS.card}`}
        onError={handleImageError}
      />
    </div>
  );
};

const MessageTimestamp = ({ timestamp, isSent, hasAttachment, hasText }) => {
  return (
    <p
      className={`text-[10px] mt-1 text-right transition-colors ${
        isSent ? 'text-orange-100' : 'text-slate-400 dark:text-slate-500'
      } ${hasAttachment && !hasText ? 'px-2 pb-1' : hasAttachment ? 'px-3' : ''}`}
    >
      {timestamp}
    </p>
  );
};

export default MessageBubble;
