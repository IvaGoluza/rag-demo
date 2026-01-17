import { useEffect, useRef } from "react";

interface ChatMessageProps {
    content: string;
    isUser: boolean;
    isNew?: boolean;
}

export const ChatMessage = ({ content, isUser, isNew = false }: ChatMessageProps) => {
    const messageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isNew && messageRef.current) {
            messageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [isNew]);

    return (
        <div
            ref={messageRef}
            className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3 ${isNew ? "message-enter" : ""}`}
        >
            <div
                className={`
          max-w-[80%] px-4 py-2.5 rounded-2xl shadow-bubble
          ${isUser
                    ? "bg-chat-user-bubble text-chat-user-bubble-foreground rounded-br-md"
                    : "bg-chat-assistant-bubble text-chat-assistant-bubble-foreground rounded-bl-md"
                }
        `}
            >
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                    {content}
                </p>
            </div>
        </div>
    );
};
