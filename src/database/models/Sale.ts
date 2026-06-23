import { Schema, model, models, Model, Types } from "mongoose";

// Snapshot of a purchased line: we store name/price as they were at sale time.
export interface ISaleItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface ISale {
  userId: Types.ObjectId;
  items: ISaleItem[];
  total: number;
  createdAt: Date;
}

const saleItemSchema = new Schema<ISaleItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const saleSchema = new Schema<ISale>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [saleItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Sale: Model<ISale> =
  (models.Sale as Model<ISale>) || model<ISale>("Sale", saleSchema);
