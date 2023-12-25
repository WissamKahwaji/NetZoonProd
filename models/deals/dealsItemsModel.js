import mongoose from "mongoose";

const DealsItemsSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    imgUrl: { type: String, required: true },
    companyName: { type: String, required: true },
    prevPrice: { type: Number, required: true, min: 1 },
    currentPrice: { type: Number, required: true, min: 1 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    country: {
      type: String,
      required: true,
    },
    description: String,
  },
  { timestamps: true }
);

export const DealsItems = mongoose.model("DealsItems", DealsItemsSchema);
