import mongoose from "mongoose";

const refundedProdcutsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderId: String,
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true,
      },
      price: Number,
      quantity: Number,
      reason: String,
      timestamp: { type: Date, default: Date.now() },
      status: { type: String, default: "pending" },
    },
  ],
});

export const refundedProductsModel = mongoose.model(
  "RefundedProducts",
  refundedProdcutsSchema
);
