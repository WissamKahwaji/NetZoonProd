import { ClientOrders } from "../models/order/client_order_model.js";
import { Order } from "../models/order/order_model.js";
import { Product } from "../models/product/product.js";
import userModel from "../models/userModel.js";
import {
  createOrder,
  updateOrder,
  getOrders,
} from "../services/order_service.js";

export const createTheOrder = async (req, res, next) => {
  try {
    const model = {
      userId: req.params.userId,
      card_Name: req.body.card_Name,
      card_Number: req.body.card_Number,
      card_ExpMonth: req.body.card_ExpMonth,
      card_ExpYear: req.body.card_ExpYear,
      card_CVC: req.body.card_CVC,
      amount: req.body.amount,
    };

    const results = await createOrder(model);

    return res.status(200).send({
      message: "Success",
      data: results,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateTheOrder = (req, res, next) => {
  updateOrder(req.body, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
};

export const findAll = (req, res, next) => {
  getOrders(req.params.userId, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
};

export const saveOrder = async (req, res) => {
  const { userId } = req.params;
  const {
    clientId,
    products,
    grandTotal,
    orderStatus,
    transactionId,
    orderEvent,
    shippingAddress,
    mobile,
    subTotal,
    serviceFee,
  } = req.body;

  try {
    // console.log(req.body);
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    for (const productItem of products) {
      const product = await Product.findById(productItem.product);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      // console.log(product);
      const quantityOrdered = productItem.qty;
      const updatedQuantity = product.quantity - quantityOrdered;
      if (updatedQuantity < 0) {
        return res
          .status(400)
          .json({ message: "Insufficient product quantity in inventory." });
      }
      await Product.findByIdAndUpdate(product._id, {
        quantity: updatedQuantity,
      });
      // console.log(productItem);
      console.log(product.owner);
      // const clientOrderModel = new ClientOrders({
      //     clientId: product.owner,
      //     product: productItem.product,
      //     amount: productItem.amount,
      //     qty: productItem.qty,
      //     totalQty: productItem.amount * productItem.qty,
      //     userId: userId,
      // });
      // await clientOrderModel.save();
    }

    const orderModel = new Order({
      userId: userId,
      clientId: clientId,
      products: products,
      orderStatus: orderStatus,
      grandTotal: grandTotal,
      orderEvent: orderEvent,
      shippingAddress: shippingAddress,
      mobile: mobile,
      subTotal: subTotal,
      serviceFee: serviceFee,
    });

    const savedOrder = await orderModel.save();

    const populatedOrder = await Order.findById(savedOrder._id)
      .populate("userId", "username email")
      .populate("clientId", "username email")
      .populate({
        path: "products.product",
        model: "Products",
        select: "name",
      });
    const client = await userModel.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "client not found" });
    }
    let updatedBalance;
    let calculateBalance;
    const netzoonBalance = client.netzoonBalance;
    if (
      client.userType == "trader" ||
      client.userType == "factory" ||
      client.userType == "local_company"
    ) {
      calculateBalance = subTotal - (subTotal * 3) / 100;
      updatedBalance = netzoonBalance + calculateBalance;
    } else {
      updatedBalance = netzoonBalance + subTotal;
    }

    await userModel.findByIdAndUpdate(clientId, {
      netzoonBalance: updatedBalance,
    });
    return res.status(200).json("Order updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    const userOrders = await Order.find({ userId })
      .populate({
        path: "products.product",
        populate: [
          { path: "category", select: "name" },
          { path: "owner", select: "username userType" },
        ],
      })
      .populate("userId", "username")
      .populate("clientId", "username");

    res.status(200).json(userOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getClientOrders = async (req, res) => {
  const { clientId } = req.params;

  try {
    const clientOrders = await Order.find({ clientId: clientId })
      .populate({
        path: "products.product",
        populate: [
          { path: "category", select: "name" },
          { path: "owner", select: "username userType" },
        ],
      })
      .populate("userId", "username")
      .populate("clientId", "username");

    res.status(200).json(clientOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id)
      .populate({
        path: "products.product",
        populate: [
          { path: "category", select: "name" },
          { path: "owner", select: "username userType" },
        ],
      })
      .populate("userId", "username");
    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json("Order not found");
    }
    await Order.findByIdAndRemove(id);
    res.json("Order deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
