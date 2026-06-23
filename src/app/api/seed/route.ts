import { connectDB } from "@/lib/database";
import { Product, type IProduct } from "@/database/models/Product";

// Sample catalog data. Image URLs are placeholders just to see the catalog.
const sampleProducts: Pick<
  IProduct,
  "name" | "price" | "image" | "description" | "specs" | "stock"
>[] = [
  {
    name: "Wireless Headphones",
    price: 129.99,
    image: "https://picsum.photos/seed/headphones/600/600",
    description: "Over-ear headphones with active noise cancellation.",
    specs: ["Bluetooth 5.3", "30h battery", "USB-C"],
    stock: 25,
  },
  {
    name: "Mechanical Keyboard",
    price: 89.5,
    image: "https://picsum.photos/seed/keyboard/600/600",
    description: "Hot-swappable mechanical keyboard with RGB backlight.",
    specs: ["Red switches", "75% layout", "Detachable cable"],
    stock: 40,
  },
  {
    name: "4K Monitor 27\"",
    price: 329.0,
    image: "https://picsum.photos/seed/monitor/600/600",
    description: "27-inch IPS monitor with HDR support.",
    specs: ["3840x2160", "144Hz", "HDMI + DisplayPort"],
    stock: 12,
  },
  {
    name: "Ergonomic Mouse",
    price: 45.99,
    image: "https://picsum.photos/seed/mouse/600/600",
    description: "Vertical ergonomic mouse to reduce wrist strain.",
    specs: ["Wireless", "4000 DPI", "6 buttons"],
    stock: 60,
  },
];

// POST /api/seed — reset the catalog with the sample products.
export async function POST() {
  try {
    await connectDB();
    await Product.deleteMany({});
    const products = await Product.insertMany(sampleProducts);
    return Response.json(
      { data: products, code: 201, message: `Seeded ${products.length} products` },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}
