import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/database";
import { Comment } from "@/database/models/Comment";

type RouteContext = { params: Promise<{ productId: string }> };

// GET /api/comments/[productId] — comments of a product, oldest first.
export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { productId } = await params;
    await connectDB();

    if (!productId || !isValidObjectId(productId)) {
      return Response.json(
        { data: null, code: 400, message: "Invalid product id" },
        { status: 400 }
      );
    }

    const comments = await Comment.find({ productId }).sort({ createdAt: 1 });
    return Response.json(
      { data: comments, code: 200, message: "Comments retrieved" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}
