"""
============================================================
CareerPilot AI — RAG Document Retriever
============================================================
Handles semantic similarity search across the vector store.
Given a query, retrieves the most relevant documents to
inject into LLM prompts as context.

TODO: Implement in Phase 1, Week 3
============================================================
"""


def retrieve_documents(query: str, collection: str, top_k: int = 5) -> list:
    """
    Retrieve the top-k most relevant documents for a query.

    Args:
        query: Natural language search query
        collection: ChromaDB collection name
        top_k: Number of results to return

    Returns:
        list: List of relevant document chunks with metadata
    """
    # TODO: Implement semantic search with ChromaDB
    return []
