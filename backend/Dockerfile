# ============================================================
# Dockerfile — CareerPilot AI Backend
# ============================================================
# Builds the FastAPI backend container.
#
# Build:   docker build -t careerpilot-backend .
# Run:     docker run -p 8000:8000 careerpilot-backend
# ============================================================

FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies needed for PDF parsing and spaCy
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download spaCy English model
RUN python -m spacy download en_core_web_sm

# Copy application source code
COPY . .

# Expose the FastAPI port
EXPOSE 8000

# Start the server with Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
