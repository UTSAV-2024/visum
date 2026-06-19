import asyncio
import sys
from app.checks.robots import check_robots
from app.checks.schema_ld import check_schema_ld
from app.checks.llms_txt import check_llms_txt
from app.checks.mcp import check_mcp
import httpx
 
async def run_manual_test(url: str):
    print(f"\nTesting: {url}\n" + "=" * 60)
 
    # Fetch content
    async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
        try: robots = (await client.get(url.rstrip("/") + "/robots.txt")).text
        except: robots = ""
        try: llms = (await client.get(url.rstrip("/") + "/llms.txt")).text
        except: llms = ""
        try: html = (await client.get(url)).text
        except: html = ""
 
    # Run all 4 checks
    checks = await asyncio.gather(
        check_robots(url, robots),
        check_schema_ld(html),
        check_llms_txt(llms),
        check_mcp(url, None),
    )
 
    total = 0
    for check in checks:
        status = "PASS" if check.passed else ("PART" if check.partial else "FAIL")
        print(f"[{status}] {check.name}: {check.score}/{check.max_score}")
        print(f"       {check.finding}")
        total += check.score
 
    print(f"\nTOTAL: {total}/65 (checks 1-4 only, max is 100 for all 8)")
 
if __name__ == "__main__":
    url = sys.argv[1] if len(sys.argv) > 1 else "https://example.com"
    asyncio.run(run_manual_test(url))
