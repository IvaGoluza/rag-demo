# RAG demo app
This is a simple Retrieval-Augmented Generation (RAG) that demonstrates how a conversational chatbot can answer questions based on a custom document knowledge base.
- Backend: Flask + LangChain RAG pipeline
- Frontend: React + TypeScript + Tailwind (built with Vite)
- Vector store: Chroma
- Embeddings & LLM: Hugging Face (open-source models)
- Conversation memory: Redis (Dockerized)
- Frontend deployment: Vercel
- Backend exposure: Cloudflared tunnel

<img width="754" height="218" alt="image" src="https://github.com/user-attachments/assets/1c4211fb-7e15-4ac5-9cfc-632d197c3406" />

### Environment Variables
Backend (.env)
You must define the following environment variables:
```
HUGGINGFACEHUB_API_TOKEN – Hugging Face access token
REDIS_URL – Redis connection URL (e.g. redis://localhost:6379)
```

Frontend (.env)
```
VITE_BACKEND_URL – URL of the backend API (local or tunneled)
```

### Running the Project Locally
1. Start Redis (required for chat memory)
```docker run -p 6379:6379 redis```
2. Run the Backend<br/>
Navigate to the backend directory and install dependencies:
```pip install -r requirements.txt```<br/>
Start the Flask server.
3. Run the Frontend<br/>
Navigate to the frontend directory:
```
npm install
npm run dev
```

### Deployment Setup
<b>Frontend (Vercel)</b> <br/>
The frontend is deployed on Vercel.<br/>

<b>Backend (Cloudflared Tunnel)</b> <br/>
The backend can run locally or on a private server and be exposed to the internet using Cloudflare Tunnel:
```
cloudflared tunnel --url VITE_BACKEND_URL
```
Set the generated tunnel URL as the ```VITE_BACKEND_URL``` environment variable in the Vercel frontend deployment settings. Don't forget to start Redis as well.

~ ~ This project is intended as a simple RAG demonstration, not a production-ready system :)


