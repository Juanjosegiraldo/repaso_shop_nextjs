const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

interface ApiResponse<T> {
  data: T;
  code: number;
  message: string;
}

// What the API returns for a comment (ids/dates serialized as strings).
export interface Comment {
  _id: string;
  productId: string;
  content: string;
  createdAt: string;
}

export async function getCommentsByProduct(productId: string): Promise<Comment[]> {
  const res = await fetch(`${BASE_URL}/api/comments/${productId}`, {
    cache: "no-store",
  });
  const json: ApiResponse<Comment[]> = await res.json();
  return json.data ?? [];
}

export async function createComment(
  productId: string,
  content: string
): Promise<Comment | null> {
  const res = await fetch(`${BASE_URL}/api/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, content }),
  });
  if (!res.ok) return null;
  const json: ApiResponse<Comment> = await res.json();
  return json.data;
}
