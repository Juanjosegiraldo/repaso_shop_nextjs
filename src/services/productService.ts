import type { IProduct } from "@/database/models/Product";

// Base URL so the service also works from Server Components (absolute fetch).
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

// Unified API envelope used across the app.
interface ApiResponse<T> {
  data: T;
  code: number;
  message: string;
}

// What the API returns: the domain fields plus the serialized id.
export type Product = IProduct & { _id: string };

// Fields the client may send when creating/updating a product.
// `image` is set by the upload flow, not typed by hand here.
export type ProductInput = {
  name: string;
  price: number;
  description?: string;
  specs?: string[];
  stock?: number;
  image?: string;
};

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/api/products`, { cache: "no-store" });
  const json: ApiResponse<Product[]> = await res.json();
  return json.data;
}

export async function getProductById(id: string): Promise<Product | null> {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  const json: ApiResponse<Product> = await res.json();
  return json.data;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json: ApiResponse<Product> = await res.json();
  return json.data;
}

// Create a product sending a multipart form (image file uploaded to Cloudinary).
export async function createProductWithImage(form: FormData): Promise<Product> {
  const res = await fetch(`${BASE_URL}/api/products/upload`, {
    method: "POST",
    body: form,
  });
  const json: ApiResponse<Product> = await res.json();
  return json.data;
}

export async function updateProduct(
  id: string,
  input: Partial<ProductInput>
): Promise<Product | null> {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (res.status === 404) return null;
  const json: ApiResponse<Product> = await res.json();
  return json.data;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, { method: "DELETE" });
  return res.ok;
}
