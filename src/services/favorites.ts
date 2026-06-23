import type { Product } from "@/services/productService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

interface ApiResponse<T> {
  data: T;
  code: number;
  message: string;
}

export async function getFavorites(userId: string): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/api/favorites?userId=${userId}`, {
    cache: "no-store",
  });
  const json: ApiResponse<Product[]> = await res.json();
  return json.data ?? [];
}

export async function toggleFavorite(
  userId: string,
  productId: string
): Promise<{ favorited: boolean }> {
  const res = await fetch(`${BASE_URL}/api/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productId }),
  });
  const json: ApiResponse<{ favorited: boolean } | null> = await res.json();
  return json.data ?? { favorited: false };
}
