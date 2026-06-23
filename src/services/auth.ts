const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

interface ApiResponse<T> {
  data: T;
  code: number;
  message: string;
}

// Session data kept on the client (no password).
export interface SessionUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<ApiResponse<SessionUser | null>> {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}

export async function loginUser(
  email: string,
  password: string
): Promise<ApiResponse<SessionUser | null>> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}
