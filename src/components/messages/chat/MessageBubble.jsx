// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const MessageBubble = ({ message }) => {
  const { text, timestamp, isSent, attachment } = message;

  return (
    <motion.div
      className={`flex ${isSent ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 transition-colors ${
          isSent
            ? "bg-orange-500 text-white rounded-br-md"
            : "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-xs rounded-bl-md"
        }`}
      >
        {attachment && <MessageAttachment src={attachment} isSent={isSent} />}
        {text && <p className="text-sm">{text}</p>}
        <MessageTimestamp timestamp={timestamp} isSent={isSent} />
      </div>
    </motion.div>
  );
};

const MessageAttachment = ({ src, isSent }) => {
  const handleImageError = (e) => {
    e.target.src =
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop";
  };

  return (
    <div className="mb-2">
      <img
        src={src}
        alt="Attachment"
        className={`max-w-48 h-auto rounded-lg object-cover ${
          isSent
            ? "border border-orange-400/30"
            : "border border-slate-100 dark:border-slate-600"
        }`}
        onError={handleImageError}
      />
    </div>
  );
};

const MessageTimestamp = ({ timestamp, isSent }) => {
  return (
    <p
      className={`text-[10px] mt-1 text-right transition-colors ${
        isSent ? "text-orange-100" : "text-slate-400 dark:text-slate-500"
      }`}
    >
      {timestamp}
    </p>
  );
};

export default MessageBubble;
