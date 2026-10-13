"""
============================================================
CareerPilot AI — Database Initialization Helper
============================================================
This script assists with creating the PostgreSQL database
'career_ai_auth' or verifying the connection.
"""

import sys
import psycopg2
from urllib.parse import urlparse
from app.config import settings

def init_postgres():
    print("=" * 60)
    print("CareerPilot AI — PostgreSQL Database Initializer")
    print("=" * 60)

    db_url = settings.DATABASE_URL
    parsed = urlparse(db_url)
    
    db_name = parsed.path.lstrip("/")
    user = parsed.username
    password = parsed.password
    host = parsed.hostname or "localhost"
    port = parsed.port or 5432

    print(f"Target Database Name : {db_name}")
    print(f"PostgreSQL Host      : {host}:{port}")
    print(f"Database Username    : {user}")
    print("-" * 60)

    # First, test connecting directly to the target database
    try:
        conn = psycopg2.connect(
            dbname=db_name,
            user=user,
            password=password,
            host=host,
            port=port
        )
        conn.close()
        print(f" Success: Database '{db_name}' already exists and connected successfully!")
        return True
    except psycopg2.OperationalError as e:
        print(f" Database '{db_name}' is not accessible directly: {e}")

    # Try connecting to the default 'postgres' database to create the target database
    print(f"Attempting to create database '{db_name}' via admin connection...")
    for admin_user, admin_pass in [(user, password), ("postgres", "postgres"), ("postgres", "admin"), ("postgres", "")]:
        try:
            conn = psycopg2.connect(
                dbname="postgres",
                user=admin_user,
                password=admin_pass,
                host=host,
                port=port
            )
            conn.autocommit = True
            cur = conn.cursor()
            cur.execute(f"CREATE DATABASE {db_name};")
            cur.close()
            conn.close()
            print(f" Successfully created database '{db_name}'!")
            return True
        except Exception:
            continue

    print("-" * 60)
    print(" Could not auto-create the database due to database permissions.")
    print("Please run this command in your PostgreSQL terminal / pgAdmin / psql:")
    print(f"    CREATE DATABASE {db_name};")
    print("=" * 60)
    return False

if __name__ == "__main__":
    init_postgres()
