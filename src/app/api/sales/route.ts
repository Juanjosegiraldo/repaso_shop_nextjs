import { isValidObjectId, Types } from "mongoose";
import { connectDB } from "@/lib/database";
import { Cart } from "@/database/models/Cart";
import { Product } from "@/database/models/Product";
import { Sale, type ISaleItem } from "@/database/models/Sale";

// POST /api/sales — turn the user's cart into a sale and empty the cart.
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const userId = typeof body.userId === "string" ? body.userId : "";

    if (!isValidObjectId(userId)) {
      return Response.json(
        { data: null, code: 400, message: "Invalid user id" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return Response.json(
        { data: null, code: 400, message: "Cart is empty" },
        { status: 400 }
      );
    }

    const productIds = cart.items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [String(p._id), p]));

    // Build a snapshot of each line at purchase time.
    const saleItems: ISaleItem[] = [];
    for (const item of cart.items) {
      const product = productMap.get(String(item.productId));
      if (product) {
        saleItems.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
        });
      }
    }

    if (saleItems.length === 0) {
      return Response.json(
        { data: null, code: 400, message: "No valid products in cart" },
        { status: 400 }
      );
    }

    const total = saleItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const sale = await Sale.create({
      userId: new Types.ObjectId(userId),
      items: saleItems,
      total,
    });

    // Empty the cart after a successful purchase.
    cart.items = [];
    await cart.save();

    return Response.json(
      { data: sale, code: 201, message: "Sale registered" },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}
