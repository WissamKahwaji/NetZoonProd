import mongoose from "mongoose";

const LegalAdviceSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  textEn: {
    type: String,
    required: true,
  },
  termofUse: String,
  termofUseEn: String,
});

export const LegalAdvice = mongoose.model("LegalAdvice", LegalAdviceSchema);
