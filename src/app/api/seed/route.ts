import { connectDB } from "@/lib/database";
import { Product, type IProduct } from "@/database/models/Product";
import { buscarImagen } from "@/helpers/pexels";

// Sample catalog data. The image is NOT set here: the seed fetches a matching
// photo by name from Pexels so the catalog fills up without manual uploads.
const sampleProducts: Omit<
  IProduct,
  "image" | "createdAt" | "updatedAt"
>[] = [
  {
    name: "Wireless Headphones",
    price: 129.99,
    description: "Over-ear headphones with active noise cancellation.",
    specs: ["Bluetooth 5.3", "30h battery", "USB-C"],
    stock: 25,
  },
  {
    name: "Mechanical Keyboard",
    price: 89.5,
    description: "Hot-swappable mechanical keyboard with RGB backlight.",
    specs: ["Red switches", "75% layout", "Detachable cable"],
    stock: 40,
  },
  {
    name: "Coffee Mug",
    price: 12.0,
    description: "Ceramic mug, 350ml, dishwasher safe.",
    specs: ["350ml", "Ceramic", "Microwave safe"],
    stock: 100,
  },
  {
    name: "Running Shoes",
    price: 79.9,
    description: "Lightweight running shoes with breathable mesh.",
    specs: ["Mesh upper", "EVA sole", "Unisex"],
    stock: 35,
  },
];

// POST /api/seed — reset the catalog and auto-assign an image per product.
export async function POST() {
  try {
    await connectDB();
    await Product.deleteMany({});

    // Resolve one image per product by its name.
    const withImages = await Promise.all(
      sampleProducts.map(async (p) => ({
        ...p,
        image: await buscarImagen(p.name),
      }))
    );

    const products = await Product.insertMany(withImages);
    return Response.json(
      { data: products, code: 201, message: `Seeded ${products.length} products` },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}
