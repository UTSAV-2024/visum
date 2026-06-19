from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from .schemas import ScanRequest, ScanResponse, ScanStatus
from .crawler import SiteCrawler
from .scorer import run_scan
import os
import uuid
from datetime import datetime
 
app = FastAPI(
    title="AgentReady API",
    description="AI agent readiness scanner for non-Shopify websites",
    version="0.1.0"
)
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 
crawler = SiteCrawler(timeout_ms=int(os.getenv("CRAWLER_TIMEOUT_MS", 30000)))
 
@app.get("/health")
async def health():
    return {"status": "ok", "version": "0.1.0"}
 
@app.post("/scan", response_model=ScanResponse)
async def scan(request: ScanRequest):
    """
    Main endpoint. Accepts a URL, crawls it, runs 8 checks, returns score.
    This is synchronous for V1 — user waits for result (15-30 seconds).
    V2 will use background tasks + websocket for real-time progress.
    """
    # Basic URL validation
    url = request.url.strip()
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
 
    try:
        # Crawl the site
        crawl_data = await crawler.crawl(url)
        crawl_data["base_url"] = crawler.get_base_url(url)
 
        # Run all 8 checks
        result = await run_scan(crawl_data)
 
        scan_id = str(uuid.uuid4())
        return ScanResponse(scan_id=scan_id, result=result)
 
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scan failed: {str(e)}")
 
@app.get("/")
async def root():
    return {
        "message": "AgentReady API",
        "docs": "/docs",
        "scan": "POST /scan with {'url': 'https://yoursite.com'}"
    }