import sys
import traceback

try:
    from app.main import app
    print("SUCCESS: app.main loaded perfectly.")
except Exception as e:
    with open("crash_log.txt", "w") as f:
        traceback.print_exc(file=f)
    print("FAILED")
