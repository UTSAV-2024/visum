# Playwright's official image ships Chromium plus every system library it needs
# (libnss3, libatk, libgbm, ...). Installing those on Render's native Python
# runtime is impossible without root, which is why Chromium could not launch
# there and the browser-dependent checks reported "not measured".
#
# Keep this tag in sync with the playwright pin in requirements.txt (1.60.0).
FROM mcr.microsoft.com/playwright/python:v1.60.0-noble

WORKDIR /app

# Dependencies first so this layer caches across code changes.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Render supplies $PORT at runtime.
ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
