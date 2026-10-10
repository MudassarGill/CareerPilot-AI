"""
============================================================
CareerPilot AI — Storage Service Abstraction
============================================================
Handles avatar saving and local file storage management.
============================================================
"""

import os
import uuid
from pathlib import Path
from fastapi import UploadFile, HTTPException

UPLOAD_DIR = Path("data/uploads/avatars")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE = 2 * 1024 * 1024  # 2MB

class StorageService:
    @staticmethod
    async def save_avatar(file: UploadFile) -> str:
        ext = Path(file.filename or "").suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Invalid image type. Allowed: JPG, PNG, WEBP.")

        contents = await file.read()
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 2MB.")

        # Save locally
        filename = f"{uuid.uuid4()}{ext}"
        filepath = UPLOAD_DIR / filename
        with open(filepath, "wb") as f:
            f.write(contents)

        return f"/uploads/avatars/{filename}"

storage_service = StorageService()
