import MessageBubble from "./MessageBubble";

const MessagesList = ({ messages, messagesEndRef, user }) => {
  return (
    <div className="flex-1 p-2 sm:p-4 overflow-y-auto custom-scrollbar bg-slate-50">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 rounded-full overflow-hidden border-2 border-orange-100">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face";
              }}
            />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-1">
            {user?.name}
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm max-w-[200px]">
            Say hello and start a conversation with {user?.name?.split(" ")[0]}!
          </p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default MessagesList;
