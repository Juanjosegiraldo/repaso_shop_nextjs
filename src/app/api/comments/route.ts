import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/database";
import { Comment } from "@/database/models/Comment";
import { Product } from "@/database/models/Product";

// POST /api/comments — create a comment for an existing product.
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const productId = typeof body.productId === "string" ? body.productId : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";

    if (!isValidObjectId(productId)) {
      return Response.json(
        { data: null, code: 400, message: "Invalid product id" },
        { status: 400 }
      );
    }
    if (content === "") {
      return Response.json(
        { data: null, code: 400, message: "content is required" },
        { status: 400 }
      );
    }

    // The product must exist before attaching a comment to it.
    const product = await Product.findById(productId);
    if (!product) {
      return Response.json(
        { data: null, code: 404, message: "Product not found" },
        { status: 404 }
      );
    }

    const comment = await Comment.create({ productId, content });
    return Response.json(
      { data: comment, code: 201, message: "Comment created" },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 400, message }, { status: 400 });
  }
}
