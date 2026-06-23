import { Schema, model, models, Model, Types } from "mongoose";

export interface ICartItem {
  productId: Types.ObjectId;
  quantity: number;
}

export interface ICart {
  userId: Types.ObjectId;
  items: ICartItem[];
}

const cartItemSchema = new Schema<ICartItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false }
);

const cartSchema = new Schema<ICart>({
  // One cart per user.
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  items: { type: [cartItemSchema], default: [] },
});

export const Cart: Model<ICart> =
  (models.Cart as Model<ICart>) || model<ICart>("Cart", cartSchema);
