export const TypingIndicator = () => {
    return (
        <div className="flex justify-start mb-3 message-enter">
            <div className="bg-chat-assistant-bubble px-4 py-3 rounded-2xl rounded-bl-md shadow-bubble">
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-chat-typing-dot typing-dot" />
                    <span className="w-2 h-2 rounded-full bg-chat-typing-dot typing-dot" />
                    <span className="w-2 h-2 rounded-full bg-chat-typing-dot typing-dot" />
                </div>
            </div>
        </div>
    );
};