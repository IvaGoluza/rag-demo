import { useState, useCallback } from "react";
import {sendMessage} from "../lib/chat.ts";

export interface Message {
    id: string;
    content: string;
    isUser: boolean;
    isNew: boolean;
}

export const useChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const addMessage = useCallback((content: string, isUser: boolean) => {
        const newMessage: Message = {
            id: crypto.randomUUID(),
            content,
            isUser,
            isNew: true,
        };

        setMessages((prev) => {
            // Mark previous messages as not new
            const updated = prev.map((msg) => ({ ...msg, isNew: false }));
            return [...updated, newMessage];
        });

        return newMessage.id;
    }, []);

    const send = useCallback(
        async (userMessage: string) => {
            if (isLoading) return;

            addMessage(userMessage, true);
            setIsLoading(true);

            try {
                const response = await sendMessage(userMessage);
                addMessage(response.answer, false);
            } catch (error) {
                console.error("Failed to send message:", error);
                addMessage("Sorry, something went wrong. Please try again.", false);
            } finally {
                setIsLoading(false);
            }
        },
        [isLoading, addMessage]
    );

    return {
        messages,
        isLoading,
        send,
    };
};
