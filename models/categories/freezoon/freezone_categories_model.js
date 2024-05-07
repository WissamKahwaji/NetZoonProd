import mongoose from "mongoose";

const freezoneCategoriesSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    titleAr: {
      type: String,
      required: true,
    },
    companies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export const FreezoneCategoriesModel = mongoose.model(
  "FreezoneCategories",
  freezoneCategoriesSchema
);
