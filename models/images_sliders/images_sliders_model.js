import mongoose from "mongoose";

const imagesSlidersSchema = new mongoose.Schema({
  mainSlider: [String],
  firstSlider: [String],
  secondslider: [String],
});

export const imagesSlidersModel = mongoose.model(
  "imagesSliders",
  imagesSlidersSchema
);
