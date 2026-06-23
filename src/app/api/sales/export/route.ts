import { connectDB } from "@/lib/database";
import { Sale } from "@/database/models/Sale";

// GET /api/sales/export — this month's sales, used to download a CSV report.
export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const sales = await Sale.find({ createdAt: { $gte: start, $lt: end } }).sort({
      createdAt: 1,
    });
    const total = sales.reduce((sum, sale) => sum + sale.total, 0);

    return Response.json(
      {
        data: { sales, count: sales.length, total },
        code: 200,
        message: "Sales export ready",
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}
