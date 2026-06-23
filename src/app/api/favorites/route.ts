import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/database";
import { Favorite } from "@/database/models/Favorite";
import { Product } from "@/database/models/Product";

// GET /api/favorites?userId=... — the favorited products of a user.
export async function GET(request: Request) {
  try {
    await connectDB();
    const userId = new URL(request.url).searchParams.get("userId") ?? "";

    if (!isValidObjectId(userId)) {
      return Response.json(
        { data: null, code: 400, message: "Invalid user id" },
        { status: 400 }
      );
    }

    const favorites = await Favorite.find({ userId });
    const productIds = favorites.map((fav) => fav.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    return Response.json(
      { data: products, code: 200, message: "Favorites retrieved" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}

// POST /api/favorites — toggle a favorite for a user/product pair.
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const userId = typeof body.userId === "string" ? body.userId : "";
    const productId = typeof body.productId === "string" ? body.productId : "";

    if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
      return Response.json(
        { data: null, code: 400, message: "Invalid user or product id" },
        { status: 400 }
      );
    }

    const existing = await Favorite.findOne({ userId, productId });
    if (existing) {
      await existing.deleteOne();
      return Response.json(
        { data: { favorited: false }, code: 200, message: "Favorite removed" },
        { status: 200 }
      );
    }

    await Favorite.create({ userId, productId });
    return Response.json(
      { data: { favorited: true }, code: 201, message: "Favorite added" },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 400, message }, { status: 400 });
  }
}
