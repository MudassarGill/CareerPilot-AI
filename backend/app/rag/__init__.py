"""
============================================================
CareerPilot AI — RAG Pipeline Package
============================================================
Retrieval-Augmented Generation (RAG) pipeline components.
This package handles document embedding, vector storage,
and intelligent retrieval for the AI agents.

Files:
    - embeddings.py   → Text embedding using sentence-transformers
    - vector_store.py → ChromaDB vector store management
    - retriever.py    → Similarity search and document retrieval

How RAG Works in CareerPilot:
    1. Documents (job descriptions, skill data, courses) are
       embedded into vectors using sentence-transformers
    2. Vectors are stored in ChromaDB (persistent storage)
    3. When an agent needs context, it queries ChromaDB
    4. Retrieved documents are injected into the LLM prompt
    5. The LLM generates responses grounded in real data

This prevents hallucination and provides accurate, up-to-date
career information to all AI agents.
============================================================
"""
