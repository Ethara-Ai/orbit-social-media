const EmptyChatState = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 p-4 transition-colors">
      <div className="text-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center transition-colors">
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400 dark:text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-200 mb-1 transition-colors">
          Select a chat
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm transition-colors">
          Choose a conversation to start messaging
        </p>
      </div>
    </div>
  );
};

export default EmptyChatState;
