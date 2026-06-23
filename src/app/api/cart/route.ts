import { isValidObjectId, Types } from "mongoose";
import { connectDB } from "@/lib/database";
import { Cart } from "@/database/models/Cart";
import { Product } from "@/database/models/Product";

// GET /api/cart?userId=... — the user's cart with product data and total.
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

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return Response.json(
        { data: { items: [], total: 0 }, code: 200, message: "Cart retrieved" },
        { status: 200 }
      );
    }

    // Join cart items with their products (skip products that no longer exist).
    const productIds = cart.items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [String(p._id), p]));

    const items = [];
    for (const item of cart.items) {
      const product = productMap.get(String(item.productId));
      if (product) items.push({ product, quantity: item.quantity });
    }
    const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

    return Response.json(
      { data: { items, total }, code: 200, message: "Cart retrieved" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}

// POST /api/cart — add a product to the user's cart (increments if present).
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const userId = typeof body.userId === "string" ? body.userId : "";
    const productId = typeof body.productId === "string" ? body.productId : "";
    const quantity = Number(body.quantity) > 0 ? Number(body.quantity) : 1;

    if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
      return Response.json(
        { data: null, code: 400, message: "Invalid user or product id" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return Response.json(
        { data: null, code: 404, message: "Product not found" },
        { status: 404 }
      );
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({
        userId: new Types.ObjectId(userId),
        items: [{ productId: new Types.ObjectId(productId), quantity }],
      });
    } else {
      const existing = cart.items.find((item) => String(item.productId) === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.items.push({ productId: new Types.ObjectId(productId), quantity });
      }
      await cart.save();
    }

    return Response.json(
      { data: cart, code: 200, message: "Product added to cart" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 400, message }, { status: 400 });
  }
}
