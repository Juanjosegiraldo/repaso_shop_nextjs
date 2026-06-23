"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/i18nContext";
import { generateSalesReport } from "@/services/ai";
import { getSalesExport } from "@/services/sales";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { text } = useTranslation();
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);

  // Dashboard requires a session.
  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  const handleGenerate = async () => {
    setLoading(true);
    setReport("");
    const result = await generateSalesReport();
    setReport(result.informe);
    setLoading(false);
  };

  // Trigger a browser download for any text content.
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownload = () => {
    downloadFile(report, "sales-report.txt", "text/plain;charset=utf-8");
  };

  // Bonus (download side): export this month's sales as a CSV file.
  const handleDownloadCsv = async () => {
    const { sales } = await getSalesExport();
    const rows: string[][] = [
      ["saleId", "date", "product", "quantity", "unitPrice", "lineTotal"],
    ];
    for (const sale of sales) {
      for (const item of sale.items) {
        rows.push([
          sale._id,
          new Date(sale.createdAt).toISOString(),
          item.name,
          String(item.quantity),
          String(item.price),
          String(item.price * item.quantity),
        ]);
      }
    }
    const csv = rows
      .map((row) =>
        row.map((field) => `"${field.replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    downloadFile(csv, "sales-report.csv", "text/csv;charset=utf-8");
  };

  if (!user) return null;

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-3xl font-bold">{text.dashboard.title}</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">{text.dashboard.aiTitle}</h2>
        <p className="text-sm text-gray-600">{text.dashboard.hint}</p>

        <div className="flex gap-3">
          <Button onPress={handleGenerate} isDisabled={loading}>
            {loading ? text.dashboard.generating : text.dashboard.generate}
          </Button>
          {report && (
            <Button onPress={handleDownload}>{text.dashboard.download}</Button>
          )}
          <Button onPress={handleDownloadCsv}>
            {text.dashboard.downloadCsv}
          </Button>
        </div>

        {report && (
          <pre className="mt-4 whitespace-pre-wrap rounded border bg-gray-50 p-4 text-sm">
            {report}
          </pre>
        )}
      </section>
    </main>
  );
}
