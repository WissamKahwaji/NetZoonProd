import { imagesSlidersModel } from "../models/images_sliders/images_sliders_model.js";

export const getImagesSliders = async (req, res) => {
  try {
    const images = await imagesSlidersModel.find();

    return res.status(200).json(images);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
