import mongoose from "mongoose";

const CompanyServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  country: String,
  imageUrl: String,
  serviceImageList: [{ type: String }],
  whatsAppNumber: String,
  bio: String,
  vedioUrl: String,
  ratings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      rating: { type: Number, required: true, min: 1, max: 5 },
    },
  ],
  totalRatings: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
});

export const CompanyServices = mongoose.model(
  "CompanyServices",
  CompanyServiceSchema
);
