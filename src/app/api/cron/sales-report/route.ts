import { connectDB } from "@/lib/database";
import { Sale } from "@/database/models/Sale";
import { sendReportEmail } from "@/lib/mail";

// GET /api/cron/sales-report — emails a summary of this month's sales.
// Vercel Cron calls this with the Authorization: Bearer <CRON_SECRET> header.
export async function GET(request: Request) {
  // Protect the endpoint: reject anyone without the shared secret.
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json(
      { data: null, code: 401, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    // Range = first day of this month (inclusive) to first day of next month.
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const sales = await Sale.find({ createdAt: { $gte: start, $lt: end } });
    const count = sales.length;
    const total = sales.reduce((sum, sale) => sum + sale.total, 0);
    const month = start.toISOString().slice(0, 7); // YYYY-MM

    const reportText =
      `ShopNova sales report (${month})\n` +
      `Orders: ${count}\n` +
      `Total revenue: $${total.toFixed(2)}`;

    const reportEmail = process.env.REPORT_EMAIL;
    if (reportEmail) {
      await sendReportEmail(
        reportEmail,
        `ShopNova - Sales report ${month}`,
        reportText
      );
    }

    return Response.json(
      { data: { month, count, total }, code: 200, message: "Report sent" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}
