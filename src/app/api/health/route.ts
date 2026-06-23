import { connectDB } from "@/lib/database";

// GET /api/health — verifies the database connection is reachable.
export async function GET() {
  try {
    await connectDB();
    return Response.json(
      { data: { status: "ok" }, code: 200, message: "Database connected" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(
      { data: null, code: 500, message },
      { status: 500 }
    );
  }
}
