import { motion } from "framer-motion";
import { Paperclip, Send, X } from "../../icons";

const MessageInput = ({
  messageText,
  setMessageText,
  messageAttachment,
  setMessageAttachment,
  onSendMessage,
  onAttachmentUpload,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleAttachmentClick = () => {
    document.getElementById("message-attachment")?.click();
  };

  const removeAttachment = () => {
    setMessageAttachment(null);
  };

  const canSend = messageText.trim() || messageAttachment;

  return (
    <div className="p-2 sm:p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors">
      {/* Attachment Preview */}
      {messageAttachment && (
        <AttachmentPreview
          attachment={messageAttachment}
          onRemove={removeAttachment}
        />
      )}

      {/* Input Row */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Hidden File Input */}
        <input
          type="file"
          id="message-attachment"
          accept="image/*"
          onChange={onAttachmentUpload}
          className="hidden"
        />

        {/* Attachment Button */}
        <motion.button
          onClick={handleAttachmentClick}
          className="p-2 sm:p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 flex-shrink-0"
          whileTap={{ scale: 0.95 }}
        >
          <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>

        {/* Text Input */}
        <input
          type="text"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 h-9 sm:h-11 px-3 sm:px-4 bg-slate-100 dark:bg-slate-800 border-0 rounded-full text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-700 transition-all"
        />

        {/* Send Button */}
        <motion.button
          onClick={onSendMessage}
          disabled={!canSend}
          className="p-2 sm:p-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-orange-500 transition-colors flex-shrink-0"
          whileHover={{ scale: canSend ? 1.05 : 1 }}
          whileTap={{ scale: canSend ? 0.95 : 1 }}
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
      </div>
    </div>
  );
};

const AttachmentPreview = ({ attachment, onRemove }) => {
  return (
    <div className="mb-2 sm:mb-3 relative inline-block">
      <img
        src={attachment}
        alt="Attachment"
        className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-600"
      />
      <button
        onClick={onRemove}
        className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-slate-900 dark:bg-slate-600 text-white rounded-full p-0.5 sm:p-1 hover:bg-slate-700 dark:hover:bg-slate-500 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

export { AttachmentPreview };
export default MessageInput;
