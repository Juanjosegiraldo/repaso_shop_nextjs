import { Schema, model, models, Model, Types } from "mongoose";

export interface IFavorite {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  createdAt: Date;
}

const favoriteSchema = new Schema<IFavorite>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// A user cannot favorite the same product twice.
favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const Favorite: Model<IFavorite> =
  (models.Favorite as Model<IFavorite>) || model<IFavorite>("Favorite", favoriteSchema);
