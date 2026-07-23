# CareerPilot AI — RAG Knowledge Base

This directory contains reference documents used by the RAG pipeline to provide accurate, grounded responses.

## Subdirectories

### `job_descriptions/`
Sample job descriptions for various roles (Software Engineer, Data Scientist, etc.). Used by the ATS Scorer and Skill Gap agents.

### `skill_taxonomies/`
Structured skill data mapping roles to required skills, proficiency levels, and categories. Used by the Skill Gap agent.

### `course_catalogs/`
Learning resource data (courses, tutorials, documentation links). Used by the Learning Roadmap agent to recommend study materials.

## Adding Data

Place `.txt`, `.md`, or `.json` files in the appropriate subdirectory. The RAG pipeline will automatically embed and index them on startup.

## Format

Each document should contain clear, structured information. Example job description format:

```
Title: Full Stack Developer
Company: [Company Name]
Requirements:
- 3+ years of experience with React and Node.js
- Proficiency in PostgreSQL
- Experience with cloud services (AWS/GCP)
...
```
