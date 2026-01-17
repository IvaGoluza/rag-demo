import { useRef, useEffect } from "react";
import {ChatHeader} from "../components/ChatHeader.tsx";
import {ChatMessage} from "../components/ChatMessage.tsx";
import {TypingIndicator} from "../components/TypingIndicator.tsx";
import {ChatInput} from "../components/ChatInput.tsx";
import {useChat} from "../hooks/useChat.ts";

const Index = () => {
    const { messages, isLoading, send } = useChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    return (
        <div className="flex flex-col h-[100dvh] bg-chat-bg">
            <ChatHeader />

            <main className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
                <div className="max-w-4xl mx-auto">
                    {messages.length === 0 && (
                        <div className="flex items-center justify-center h-full min-h-[200px]">
                            <p className="text-muted-foreground text-center">
                                Send a message to start the conversation
                            </p>
                        </div>
                    )}

                    {messages.map((message) => (
                        <ChatMessage
                            key={message.id}
                            content={message.content}
                            isUser={message.isUser}
                            isNew={message.isNew}
                        />
                    ))}

                    {isLoading && <TypingIndicator />}

                    <div ref={messagesEndRef} />
                </div>
            </main>

            <ChatInput onSend={send} disabled={isLoading} />
        </div>
    );
};

export default Index;