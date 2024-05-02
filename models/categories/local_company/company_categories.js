import mongoose from "mongoose";

const localCompaniesCategoriesSchema = mongoose.Schema(
  {
    title_en: {
      type: String,
      required: true,
    },
    title_ar: {
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
export const LocalCompanyCategories = mongoose.model(
  "LocalCompanyCategories",
  localCompaniesCategoriesSchema
);
