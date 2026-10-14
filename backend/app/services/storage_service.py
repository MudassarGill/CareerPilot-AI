"""
============================================================
CareerPilot AI — Storage Service Abstraction
============================================================
Handles avatar saving, resume file storage, and local file
management across the application.
============================================================
"""

import os
import uuid
from pathlib import Path
from fastapi import UploadFile, HTTPException

# ---- Avatar Storage ----
AVATAR_UPLOAD_DIR = Path("data/uploads/avatars")
AVATAR_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

AVATAR_ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
AVATAR_MAX_FILE_SIZE = 2 * 1024 * 1024  # 2MB

# ---- Resume Storage ----
RESUME_UPLOAD_DIR = Path("data/uploads/resumes")
RESUME_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

RESUME_ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc"}
RESUME_MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


class StorageService:
    @staticmethod
    async def save_avatar(file: UploadFile) -> str:
        ext = Path(file.filename or "").suffix.lower()
        if ext not in AVATAR_ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Invalid image type. Allowed: JPG, PNG, WEBP.")

        contents = await file.read()
        if len(contents) > AVATAR_MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 2MB.")

        # Save locally
        filename = f"{uuid.uuid4()}{ext}"
        filepath = AVATAR_UPLOAD_DIR / filename
        with open(filepath, "wb") as f:
            f.write(contents)

        return f"/uploads/avatars/{filename}"

    @staticmethod
    async def save_resume(file: UploadFile) -> dict:
        """
        Save an uploaded resume file (PDF/DOCX).

        Returns:
            dict with: file_url, file_path (absolute), original_name
        """
        original_name = file.filename or "resume"
        ext = Path(original_name).suffix.lower()

        if ext not in RESUME_ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type '{ext}'. Allowed: PDF, DOCX."
            )

        contents = await file.read()
        if len(contents) > RESUME_MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail="File too large. Maximum resume size is 5MB."
            )

        if len(contents) == 0:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty."
            )

        # Save with UUID filename
        filename = f"{uuid.uuid4()}{ext}"
        filepath = RESUME_UPLOAD_DIR / filename
        with open(filepath, "wb") as f:
            f.write(contents)

        return {
            "file_url": f"/uploads/resumes/{filename}",
            "file_path": str(filepath.resolve()),
            "original_name": original_name,
        }

    @staticmethod
    def delete_file(file_url: str) -> bool:
        """
        Delete a file by its relative URL path.
        Returns True if deleted, False if not found.
        """
        # Convert URL path to filesystem path
        # e.g., "/uploads/resumes/abc.pdf" -> "data/uploads/resumes/abc.pdf"
        if file_url.startswith("/uploads/"):
            rel_path = file_url.lstrip("/")
            filepath = Path("data") / rel_path
            if filepath.exists():
                filepath.unlink()
                return True
        return False


storage_service = StorageService()
