"""
============================================================
CareerPilot AI — ChromaDB Vector Store
============================================================
Manages the ChromaDB vector database for storing and querying
document embeddings. Used by the RAG pipeline.

Collections:
    - job_descriptions  → Job posting embeddings
    - skill_taxonomies  → Skill requirement embeddings
    - course_catalogs   → Learning resource embeddings
    - user_resumes      → Uploaded resume embeddings

TODO: Implement in Phase 1, Week 3
============================================================
"""

# import chromadb
# from app.config import settings


def get_vector_store():
    """
    Get or create a persistent ChromaDB client.

    Returns:
        chromadb.PersistentClient: ChromaDB client instance
    """
    # TODO: Implement ChromaDB persistent client
    pass
