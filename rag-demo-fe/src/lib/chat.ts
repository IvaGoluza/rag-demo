// Configure your backend URL here
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SESSION_KEY = "chat_session_id";

export const getSessionId = (): string => {
    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
};

export interface ChatResponse {
    answer: string;
    sources?: unknown[];
}

export const sendMessage = async (question: string): Promise<ChatResponse> => {
    const sessionId = getSessionId();

    const response = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            question,
            session_id: sessionId,
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Backend error ${response.status}: ${text}`);
    }

    return response.json();
};
