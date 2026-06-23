import { Schema, model, models, Model } from "mongoose";

// Domain shape of a product. `_id` is not declared here: Mongoose adds it
// automatically and the service layer exposes it as a string (see Product type).
export interface IProduct {
  name: string;
  price: number;
  // Secure Cloudinary URL. Filled when an image is uploaded, never typed by hand.
  image: string;
  // Extended fields shown only on the product detail page:
  description: string;
  specs: string[];
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    specs: { type: [String], default: [] },
    stock: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "stock must be an integer",
      },
    },
  },
  { timestamps: true }
);

// models.Product || model(...) avoids OverwriteModelError on hot reload.
export const Product: Model<IProduct> =
  (models.Product as Model<IProduct>) || model<IProduct>("Product", productSchema);
