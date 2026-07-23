"""
============================================================
CareerPilot AI — Text Embeddings Service
============================================================
Converts text into vector embeddings for semantic similarity
search using sentence-transformers.

Model: all-MiniLM-L6-v2 (fast, lightweight, 384-dim vectors)

Usage:
    from app.rag.embeddings import get_embedding
    vector = get_embedding("Python developer with 3 years experience")

TODO: Implement in Phase 1, Week 3
============================================================
"""

# from sentence_transformers import SentenceTransformer
# model = SentenceTransformer("all-MiniLM-L6-v2")


def get_embedding(text: str) -> list:
    """
    Convert text to a vector embedding.

    Args:
        text: Input text to embed

    Returns:
        list: 384-dimensional float vector
    """
    # TODO: Implement with sentence-transformers
    return []
