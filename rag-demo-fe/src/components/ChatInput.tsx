import { useState, type KeyboardEvent } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        const trimmed = message.trim();
        if (trimmed && !disabled) {
            onSend(trimmed);
            setMessage("");
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="bg-chat-input-bar px-3 py-2 shadow-input-bar border-t border-border">
            <div className="flex items-end gap-2 max-w-4xl mx-auto">
                <div className="flex-1 bg-secondary rounded-3xl px-4 py-2">
          <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              disabled={disabled}
              rows={1}
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-[15px] resize-none outline-none max-h-32 leading-relaxed disabled:opacity-50"
              style={{
                  height: "auto",
                  minHeight: "24px",
              }}
              onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
              }}
          />
                </div>
                <button
                    onClick={handleSend}
                    disabled={disabled || !message.trim()}
                    className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                    aria-label="Send message"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};