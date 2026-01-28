import os
import glob
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# LangChain
from langchain.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_huggingface import (
    HuggingFaceEmbeddings,
    HuggingFaceEndpoint,
    ChatHuggingFace,
)
from langchain.prompts import PromptTemplate
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.memory.chat_message_histories import RedisChatMessageHistory

# ------------------------------------------------------------------------------
# Environment
# ------------------------------------------------------------------------------

load_dotenv()

HF_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

if not HF_TOKEN:
    raise RuntimeError("HUGGINGFACEHUB_API_TOKEN not set")

os.environ["HUGGINGFACEHUB_API_TOKEN"] = HF_TOKEN

# ------------------------------------------------------------------------------
# Flask
# ------------------------------------------------------------------------------

app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True,
)

# ------------------------------------------------------------------------------
# Build RAG ONCE
# ------------------------------------------------------------------------------

print("🔹 Initializing RAG pipeline...")

# Load PDFs
pdf_files = glob.glob("./knowledge_base/*.pdf")
documents = []

for pdf in pdf_files:
    print(f"➡️ Loading PDF: {pdf}")
    loader = PyPDFLoader(pdf)
    docs = loader.load()
    print(f"    Pages loaded: {len(docs)}")
    documents.extend(docs)

print(f"📄 PDFs found: {len(pdf_files)}")
print(f"📄 Pages loaded: {len(documents)}")
for i, d in enumerate(documents[:5]):
    print(f"Page {i} length:", len(d.page_content))

# Split
splitter = RecursiveCharacterTextSplitter(
    chunk_size=2000,
    chunk_overlap=200,
    separators=["\n\n", "\n", "(?<=\\. )", " ", ""],
)

splits = splitter.split_documents(documents)

print(f"✂️ Chunks created: {len(splits)}")
print("Sample chunk:", splits[0].page_content[:300])

# Embeddings
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-mpnet-base-v2"
)

persist_directory = os.path.join(os.getcwd(), "chroma")

# Vector store (load or create)
vectordb = Chroma.from_documents(
    documents=splits,
    embedding=embeddings,
    persist_directory=persist_directory,
)

# LLM
llm_endpoint = HuggingFaceEndpoint(
    repo_id="meta-llama/Meta-Llama-3-8B-Instruct",
    task="conversational",
)

llm = ChatHuggingFace(llm=llm_endpoint)

# Prompt
QA_PROMPT = PromptTemplate(
    input_variables=["context", "question"],
    template="""
You are a question-answering assistant.

Answer the question in Croatian language.
Answer the question using ONLY the context.
Do NOT guess. Do not include internet based answers outside provided context.
If you cannot find the answer, respond:
"Ne mogu odgovoriti iz danih dokumenata."

Use full sentences and longer answer.

Context:
{context}

Question:
{question}

Answer:
""",
)

print("✅ RAG ready")

# ------------------------------------------------------------------------------
# Helpers
# ------------------------------------------------------------------------------

def get_memory(session_id: str):
    chat_history = RedisChatMessageHistory(
        session_id=session_id,
        url=REDIS_URL,
    )

    return ConversationBufferMemory(
        chat_memory=chat_history,
        memory_key="chat_history",
        return_messages=True,
        output_key="answer",
    )


def get_qa_chain(session_id: str):
    memory = get_memory(session_id)

    return ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectordb.as_retriever(),
        memory=memory,
        return_source_documents=True,
        combine_docs_chain_kwargs={"prompt": QA_PROMPT},
    )

# ------------------------------------------------------------------------------
# API
# ------------------------------------------------------------------------------

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()

    question = data.get("question")
    session_id = data.get("session_id")

    if not question or not session_id:
        return jsonify({"error": "Missing question or session_id"}), 400

    qa = get_qa_chain(session_id)
    result = qa.invoke({"question": question})

    return jsonify({
        "question": question,
        "answer": result["answer"],
        "sources": [
            {
                "source": doc.metadata.get("source"),
                "content": doc.page_content,
            }
            for doc in result["source_documents"]
        ],
    })


@app.route("/health", methods=["GET"])
def health():
    return {"status": "ok"}

# ------------------------------------------------------------------------------
# Run
# ------------------------------------------------------------------------------

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True, use_reloader=False)
