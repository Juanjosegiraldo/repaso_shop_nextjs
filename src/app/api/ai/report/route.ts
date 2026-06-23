import { GoogleGenAI } from "@google/genai";
import { connectDB } from "@/lib/database";
import { Sale } from "@/database/models/Sale";
import { Product } from "@/database/models/Product";

interface SoldEntry {
  name: string;
  units: number;
  revenue: number;
}

// POST /api/ai/report — ask Gemini for a plain-text rotation/stock report.
export async function POST() {
  try {
    // Controlled error when the key is missing (chat subscriptions don't work).
    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { data: null, code: 500, message: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    await connectDB();

    // Aggregate units sold per product across all sales.
    const sales = await Sale.find();
    const soldMap = new Map<string, SoldEntry>();
    for (const sale of sales) {
      for (const item of sale.items) {
        const key = String(item.productId);
        const entry = soldMap.get(key) ?? { name: item.name, units: 0, revenue: 0 };
        entry.units += item.quantity;
        entry.revenue += item.price * item.quantity;
        soldMap.set(key, entry);
      }
    }

    const products = await Product.find();
    const datos = {
      masVendidos: [...soldMap.values()].sort((a, b) => b.units - a.units).slice(0, 10),
      stockActual: products.map((p) => ({ name: p.name, stock: p.stock })),
    };

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const contents =
      "Genera un informe en texto plano (sin markdown) de las referencias con " +
      "mayor rotación (más vendidas) y el stock que conviene mantener, con estos " +
      `datos: ${JSON.stringify(datos)}`;

    // All Flash (free tier). Lite first for reliability; fall back to standard
    // flash if it is unavailable. Both are free-tier models.
    const models = ["gemini-2.5-flash-lite", "gemini-2.5-flash"];
    let informe = "";
    let lastError = "";
    for (const model of models) {
      try {
        const response = await ai.models.generateContent({ model, contents });
        informe = response.text ?? "";
        if (informe) break;
      } catch (modelError) {
        lastError = modelError instanceof Error ? modelError.message : String(modelError);
      }
    }

    if (!informe) {
      throw new Error(lastError || "No model returned a report");
    }

    return Response.json(
      { data: { informe }, code: 200, message: "Report generated" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}
