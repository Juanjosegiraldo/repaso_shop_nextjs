import { connectDB } from "@/lib/database";
import { Product } from "@/database/models/Product";

// GET /api/products — list all products (catalog).
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });
    return Response.json(
      { data: products, code: 200, message: "Products retrieved" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}

// POST /api/products — create a product (name and price required).
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    if (typeof body.name !== "string" || body.name.trim() === "") {
      return Response.json(
        { data: null, code: 400, message: "name is required" },
        { status: 400 }
      );
    }
    if (typeof body.price !== "number" || body.price < 0) {
      return Response.json(
        { data: null, code: 400, message: "price must be a number >= 0" },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name: body.name,
      price: body.price,
      image: body.image,
      description: body.description,
      specs: body.specs,
      stock: body.stock,
    });

    return Response.json(
      { data: product, code: 201, message: "Product created" },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 400, message }, { status: 400 });
  }
}
