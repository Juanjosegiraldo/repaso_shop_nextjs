const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

interface ApiResponse<T> {
  data: T;
  code: number;
  message: string;
}

export interface SaleItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Sale {
  _id: string;
  userId: string;
  items: SaleItem[];
  total: number;
  createdAt: string;
}

export interface SalesExport {
  sales: Sale[];
  count: number;
  total: number;
}

// Fetch this month's sales so the dashboard can build a downloadable CSV.
export async function getSalesExport(): Promise<SalesExport> {
  const res = await fetch(`${BASE_URL}/api/sales/export`, { cache: "no-store" });
  const json: ApiResponse<SalesExport | null> = await res.json();
  return json.data ?? { sales: [], count: 0, total: 0 };
}

// Register the purchase: the server turns the user's cart into a sale.
export async function createSale(userId: string): Promise<Sale | null> {
  const res = await fetch(`${BASE_URL}/api/sales`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) return null;
  const json: ApiResponse<Sale> = await res.json();
  return json.data;
}
