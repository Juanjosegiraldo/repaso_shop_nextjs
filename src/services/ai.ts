const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

interface ApiResponse<T> {
  data: T;
  code: number;
  message: string;
}

// Ask the API to generate the AI sales report. Returns ok=false on failure
// so the UI can show a controlled error (e.g. missing GEMINI_API_KEY).
export async function generateSalesReport(): Promise<{ ok: boolean; informe: string }> {
  const res = await fetch(`${BASE_URL}/api/ai/report`, { method: "POST" });
  const json: ApiResponse<{ informe: string } | null> = await res.json();

  if (!res.ok || !json.data) {
    return { ok: false, informe: json.message };
  }
  return { ok: true, informe: json.data.informe };
}
