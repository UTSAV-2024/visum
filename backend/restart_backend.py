"""Kill all processes on port 8000 and restart the FastAPI backend."""
import subprocess, time, os, sys

# Kill anything on port 8000
result = subprocess.run(["netstat", "-ano"], capture_output=True, text=True)
killed = []
for line in result.stdout.splitlines():
    if ":8000" in line and "LISTENING" in line:
        parts = line.strip().split()
        pid = parts[-1]
        try:
            subprocess.run(["taskkill", "/F", "/PID", pid], capture_output=True, timeout=5)
            killed.append(pid)
            print(f"Killed PID {pid}")
        except Exception as e:
            print(f"Failed to kill PID {pid}: {e}")

if not killed:
    print("No processes found on port 8000")

time.sleep(2)

# Verify port is free
result = subprocess.run(["netstat", "-ano"], capture_output=True, text=True)
still_listening = False
for line in result.stdout.splitlines():
    if ":8000" in line and "LISTENING" in line:
        still_listening = True
        print(f"Still listening: {line.strip()}")

if still_listening:
    print("Port still in use, waiting longer...")
    time.sleep(5)

# Start the backend
print("Starting backend...")
backend_dir = os.path.join(os.path.dirname(__file__))
proc = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"],
    cwd=backend_dir,
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
)
print(f"Backend started with PID {proc.pid}")
time.sleep(3)

# Verify it's running
try:
    import urllib.request
    resp = urllib.request.urlopen("http://localhost:8000/health", timeout=5)
    print(f"Health check: {resp.read().decode()}")
except Exception as e:
    print(f"Health check failed: {e}")

print("Done")
