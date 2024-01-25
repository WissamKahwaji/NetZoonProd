import mongoose from "mongoose";

const purchDealsSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DealsItems",
      required: true,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      type: String,
    },
    mobile: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const PurchDeals = mongoose.model("PurchDeals", purchDealsSchema);
