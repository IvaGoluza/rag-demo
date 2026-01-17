import { MessageCircle } from "lucide-react";

export const ChatHeader = () => {
    return (
        <header className="bg-chat-header text-chat-header-foreground px-4 py-3 shadow-header flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
            </div>
            <div>
                <h1 className="font-semibold text-lg leading-tight">RAG Assistant</h1>

                <p className="text-xs opacity-80">Online</p>
            </div>
        </header>
    );
};