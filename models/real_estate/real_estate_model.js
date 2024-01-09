import mongoose from "mongoose";

const RealEstateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    area: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    amenities: {
      type: [String],
    },
    images: {
      type: [String],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    type: String,
    category: String,
    forWhat: String,
    furnishing: Boolean,
  },
  { timestamps: true }
);

export const RealEstate = mongoose.model("RealEstate", RealEstateSchema);
