import { refundedProductsModel } from "../models/refunded_products/refunded_products_model.js";
import userModel from "../models/userModel.js";

export const getRefundedProducts = async (req, res) => {
  try {
    const products = await refundedProductsModel.find();

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserRefundedProducts = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel
      .findById(userId)
      .populate({
        path: "refundedProducts",
        populate: {
          path: "products",
          populate: {
            path: "productId",
            populate: [
              {
                path: "owner",
                select: "username userType",
              },
              {
                path: "category",
                select: "name",
              },
            ],
          },
        },
      })
      .select("refundedProducts");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const refundedProducts = user.refundedProducts;

    return res.json(refundedProducts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
