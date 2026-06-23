import type { Product } from "@/services/productService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

interface ApiResponse<T> {
  data: T;
  code: number;
  message: string;
}

export interface CartLine {
  product: Product;
  quantity: number;
}

export interface CartView {
  items: CartLine[];
  total: number;
}

export async function getCart(userId: string): Promise<CartView> {
  const res = await fetch(`${BASE_URL}/api/cart?userId=${userId}`, {
    cache: "no-store",
  });
  const json: ApiResponse<CartView> = await res.json();
  return json.data ?? { items: [], total: 0 };
}

export async function addToCart(
  userId: string,
  productId: string,
  quantity = 1
): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/api/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productId, quantity }),
  });
  return res.ok;
}
