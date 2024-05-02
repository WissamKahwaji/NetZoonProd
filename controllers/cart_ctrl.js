import {
  addToCart,
  clearCart,
  getCart,
  updateCart,
} from "../services/cart_service.js";

export const getCartController = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (req.userId != userId) {
      return res.status(403).json("Error in Authurization");
    }
    const response = await getCart({ userId: userId });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const addToCartController = async (req, res, next) => {
  try {
    const params = {
      userId: req.params.userId,
      productId: req.body.productId,
      quantity: req.body.quantity,
    };
    if (req.userId != userId) {
      return res.status(403).json("Error in Authurization");
    }
    const response = await addToCart(params);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateCartController = async (req, res, next) => {
  try {
    const params = {
      userId: req.params.userId,
      productId: req.body.productId,
      quantity: req.body.quantity,
      deleteItem: req.body.deleteItem,
    };
    if (req.userId != userId) {
      return res.status(403).json("Error in Authurization");
    }
    const response = await updateCart(params);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const clearCartController = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (req.userId != userId) {
      return res.status(403).json("Error in Authurization");
    }
    const response = await clearCart(userId);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
