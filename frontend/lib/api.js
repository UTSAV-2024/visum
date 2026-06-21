const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function scanUrl(url) {
  const response = await fetch(`${API_URL}/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, email,}),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Scan failed");
  }

  return response.json();
}
