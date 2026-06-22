"""Debug CORS configuration on the running backend."""
import os
from dotenv import load_dotenv
from pathlib import Path
import json

# Same logic as main.py
BASE_DIR = Path(__file__).resolve().parents[1]  # backend/debug_cors.py -> backend/ -> project root
load_dotenv(BASE_DIR / ".env.local")

allowed_raw = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
allowed_origins = allowed_raw.split(",")

print(f"BASE_DIR: {BASE_DIR}")
print(f"ENV_FILE: {BASE_DIR / '.env.local'}")
print(f"File exists: {(BASE_DIR / '.env.local').exists()}")
print(f"Raw ALLOWED_ORIGINS: {repr(allowed_raw)}")
print(f"Parsed list: {json.dumps(allowed_origins, indent=2)}")

# Test a CORS request manually using urllib
import urllib.request

req = urllib.request.Request(
    "http://localhost:8000/scan",
    method="OPTIONS",
    headers={
        "Origin": "http://192.168.29.153:3000",
        "Access-Control-Request-Method": "POST",
    },
)
try:
    resp = urllib.request.urlopen(req, timeout=5)
    print(f"\nCORS response status: {resp.status}")
    for key, val in resp.headers.items():
        if "access-control" in key.lower() or "origin" in key.lower() or "vary" in key.lower():
            print(f"  {key}: {val}")
except urllib.error.HTTPError as e:
    print(f"\nCORS response status: {e.code}")
    for key, val in e.headers.items():
        if "access-control" in key.lower() or "origin" in key.lower() or "vary" in key.lower():
            print(f"  {key}: {val}")
    print(f"  Body: {e.read().decode()}")
except Exception as e:
    print(f"\nCORS request error: {e}")
