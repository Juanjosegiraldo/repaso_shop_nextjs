import { Schema, model, models, Model, Types } from "mongoose";

export interface IComment {
  productId: Types.ObjectId;
  content: string;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    content: { type: String, required: true, trim: true },
  },
  // Only createdAt: a comment is never edited, so we don't need updatedAt.
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Comment: Model<IComment> =
  (models.Comment as Model<IComment>) || model<IComment>("Comment", commentSchema);
