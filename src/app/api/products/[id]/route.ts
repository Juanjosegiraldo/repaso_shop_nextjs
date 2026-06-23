import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/database";
import { Product, type IProduct } from "@/database/models/Product";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/products/[id] — one product, 404 if it does not exist.
export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    await connectDB();

    if (!isValidObjectId(id)) {
      return Response.json(
        { data: null, code: 404, message: "Product not found" },
        { status: 404 }
      );
    }

    const product = await Product.findById(id);
    if (!product) {
      return Response.json(
        { data: null, code: 404, message: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { data: product, code: 200, message: "Product retrieved" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}

// PUT /api/products/[id] — partial update.
export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    await connectDB();

    if (!isValidObjectId(id)) {
      return Response.json(
        { data: null, code: 404, message: "Product not found" },
        { status: 404 }
      );
    }

    const body: Partial<IProduct> = await request.json();
    const product = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return Response.json(
        { data: null, code: 404, message: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { data: product, code: 200, message: "Product updated" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 400, message }, { status: 400 });
  }
}

// DELETE /api/products/[id] — remove a product.
export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    await connectDB();

    if (!isValidObjectId(id)) {
      return Response.json(
        { data: null, code: 404, message: "Product not found" },
        { status: 404 }
      );
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return Response.json(
        { data: null, code: 404, message: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { data: product, code: 200, message: "Product deleted" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}
