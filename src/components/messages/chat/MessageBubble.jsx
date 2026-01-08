// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const MessageBubble = ({ message }) => {
  const { text, timestamp, isSent, attachment } = message;
  const hasOnlyAttachment = attachment && !text;

  return (
    <motion.div
      className={`flex ${isSent ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`max-w-[75%] rounded-2xl overflow-hidden transition-colors ${
          isSent
            ? "bg-orange-500 text-white rounded-br-md"
            : "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-xs rounded-bl-md"
        } ${hasOnlyAttachment ? "p-1" : attachment ? "pb-2" : "px-4 py-2.5"}`}
      >
        {attachment && (
          <MessageAttachment
            src={attachment}
            isSent={isSent}
            hasText={!!text}
          />
        )}
        {text && (
          <p className={`text-sm ${attachment ? "px-3 pt-1.5" : ""}`}>{text}</p>
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
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop";
  };

  return (
    <div className={hasText ? "mb-1" : ""}>
      <img
        src={src}
        alt="Attachment"
        className={`w-full max-w-xs h-auto object-cover ${
          hasText ? "rounded-xl" : "rounded-xl"
        }`}
        onError={handleImageError}
      />
    </div>
  );
};

const MessageTimestamp = ({ timestamp, isSent, hasAttachment, hasText }) => {
  return (
    <p
      className={`text-[10px] mt-1 text-right transition-colors ${
        isSent ? "text-orange-100" : "text-slate-400 dark:text-slate-500"
      } ${hasAttachment && !hasText ? "px-2 pb-1" : hasAttachment ? "px-3" : ""}`}
    >
      {timestamp}
    </p>
  );
};

export default MessageBubble;
