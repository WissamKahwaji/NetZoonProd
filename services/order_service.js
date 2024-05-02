import userModel from "../models/userModel.js";
import { Card } from "../models/card/card.model.js";
import {
  addCard,
  createCustomer,
  generatePaymentIntent,
} from "./stripe_service.js";
import { Order } from "../models/order/order_model.js";
import { emptyUserCart, getCart } from "./cart_service.js";
import { Product } from "../models/product/product.js";

// export const createOrder = async (params, callback) => {
//     console.log("1");
//     await userModel.findOne({ _id: params.userId }, async (err, userDB) => {
//         if (err) {
//             return callback(err);
//         }
//         else {

//             var model = {};
//             if (!userDB.stripeCustomerID) {
//                 await createCustomer({
//                     "name": userDB.username,
//                     "email": userDB.email,
//                 }, (error, results) => {
//                     if (error) {
//                         return callback(error);
//                     }
//                     if (results) {
//                         userDB.stripeCustomerID = results.id;
//                         userDB.save();

//                         model.stripeCustomerID = results.id;
//                     }
//                 })
//             }
//             else {
//                 model.stripeCustomerID = userDB.stripeCustomerID;
//             }

//             await Card.findOne({
//                 customerId: model.stripeCustomerID,
//                 cardNumber: params.card_Number,
//                 cardExpMonth: params.card_ExpMonth,
//                 cardExpYear: params.card_ExpYear,
//             }, async (error, cardDB) => {
//                 if (error) {
//                     return callback(error);
//                 }
//                 else {
//                     if (!cardDB) {
//                         await addCard({
//                             "card_Name": params.card_Name,
//                             "card_Number": params.card_Number,
//                             "card_ExpMonth": params.card_ExpMonth,
//                             "card_ExpYear": params.card_ExpYear,
//                             "card_CVC": params.card_CVC,
//                             "customer_id": model.stripeCustomerID,
//                         }, (error, results) => {
//                             if (error) {
//                                 return callback(error);
//                             }
//                             if (results) {
//                                 const cardModel = new Card({
//                                     cardId: results.card,
//                                     cardName: params.card_Name,
//                                     cardNumber: params.card_Number,
//                                     cardExpMonth: params.card_ExpMonth,
//                                     cardExpYear: params.card_ExpYear,
//                                     cardCVC: params.card_CVC,
//                                     customerId: model.stripeCustomerID,

//                                 });
//                                 cardModel.save();
//                                 model.cardId = results.card;
//                             }
//                         });
//                     }
//                     else {
//                         model.cardId = cardDB.cardId;
//                     }

//                     await generatePaymentIntent({
//                         "receipt_email": userDB.email,
//                         "amount": params.amount,
//                         "card_id": model.cardId,
//                         "customer_id": model.stripeCustomerID,
//                     }, async (error, results) => {
//                         if (error) {
//                             return callback(error);
//                         }

//                         if (results) {
//                             model.paymentIntentId = results.id;
//                             model.client_secret = results.client_secret;
//                         }
//                     });

//                     await getCart({ userId: userDB.id }, function (err, cartDB) {
//                         if (err) {
//                             return callback(err);
//                         }
//                         else {
//                             if (cartDB) {
//                                 var products = [];
//                                 var grandTotal = 0;
//                                 cartDB.products.forEach(product => {
//                                     products.push({
//                                         product: product.product._id,
//                                         qty: product.quantity,
//                                         amount: product.product.priceAfterDiscount
//                                     });
//                                     grandTotal += product.product.priceAfterDiscount
//                                 });
//                                 const orderModel = new Order({
//                                     usesrId: cartDB.userId,
//                                     products: products,
//                                     orderStatus: 'pending',
//                                     grandTotal: grandTotal,
//                                 });
//                                 orderModel.save().then((response) => {
//                                     model.orderId = response._id;
//                                     return callback(null, model);
//                                 }).catch((err) => {
//                                     return callback(err);
//                                 });
//                             }
//                         }
//                     });
//                 }
//             });
//         }
//     })
// };

export const createOrder = async params => {
  try {
    console.log("create order");
    const userDB = await userModel.findOne({ _id: params.userId }).exec();
    console.log("this is userDB");
    console.log(userDB);

    if (!userDB) {
      throw new Error("User not found");
    }

    let model = {};

    if (!userDB.stripeCustomerId) {
      //   const customer = await createCustomer({
      //     name: userDB.username,
      //     email: userDB.email,
      //   });

      //   userDB.stripeCustomerId = customer.id;
      //   await userDB.save();

      //   model.stripeCustomerId = customer.id;
      let customer = await stripe.customers.list({ email: userDB.email });
      if (customer.data.length > 0) {
        customer = customer.data[0];
      } else {
        customer = await stripe.customers.create({
          name: userDB.username,
          email: userDB.email,
        });
      }
      userDB.stripeCustomerId = customer.id;
      await userDB.save();

      model.stripeCustomerId = customer.id;
    } else {
      model.stripeCustomerId = userDB.stripeCustomerId;
    }

    // const cardDB = await Card.findOne({
    //     customerId: model.stripeCustomerId,
    //     cardNumber: params.card_Number,
    //     cardExpMonth: params.card_ExpMonth,
    //     cardExpYear: params.card_ExpYear,
    // }).exec();
    // console.log('cardDB');
    // console.log(cardDB);
    // if (!cardDB) {
    //     const cardResult = await addCard({
    //         card_Name: params.card_Name,
    //         card_Number: params.card_Number,
    //         card_ExpMonth: params.card_ExpMonth,
    //         card_ExpYear: params.card_ExpYear,
    //         card_CVC: params.card_CVC,
    //         customer_id: model.stripeCustomerId,
    //     });

    //     const cardModel = new Card({
    //         cardId: cardResult.card,
    //         cardName: params.card_Name,
    //         cardNumber: params.card_Number,
    //         cardExpMonth: params.card_ExpMonth,
    //         cardExpYear: params.card_ExpYear,
    //         cardCVC: params.card_CVC,
    //         customerId: model.stripeCustomerId,
    //     });

    //     await cardModel.save();
    //     model.cardId = cardResult.card;
    // } else {
    //     model.cardId = cardDB.cardId;
    // }
    // const ephemeralKey = await stripe.ephemeralKeys.create(
    //   { customer: model.stripeCustomerId },
    //   { apiVersion: "2023-10-16" }
    // );
    // model.ephemeralKey = ephemeralKey;
    console.log("generatePaymentIntent");
    const paymentIntentResult = await generatePaymentIntent({
      amount: params.amount,
      customer_id: model.stripeCustomerId,
    });
    console.log("generatePaymentIntent done");
    model.paymentIntentId = paymentIntentResult.id;
    model.client_secret = paymentIntentResult.client_secret;
    const cartDB = await getCart({ userId: userDB.id });

    if (!cartDB) {
      throw new Error("Cart not found");
    }

    console.log(cartDB);

    let products = [];

    for (const productItem of cartDB.products) {
      const product = await Product.findById(productItem.product);

      if (!product) {
        throw new Error("Product not found");
      }

      const quantityOrdered = productItem.qty;
      const updatedQuantity = product.quantity - quantityOrdered;

      if (updatedQuantity < 0) {
        throw new Error("Insufficient product quantity in inventory.");
      }

      await Product.findByIdAndUpdate(product._id, {
        quantity: updatedQuantity,
      });

      products.push({
        product: productItem.product,
        qty: productItem.qty,
        amount: product.priceAfterDiscount ?? product.price,
      });
    }
    const orderModel = new Order({
      userId: cartDB.userId,
      clientId: params.clientId,
      products: products,
      orderStatus: "pending",
      grandTotal: params.grandTotal,
      orderEvent: params.orderEvent,
      shippingAddress: params.shippingAddress,
      mobile: params.mobile,
      subTotal: params.subTotal,
      serviceFee: params.serviceFee,
    });

    const response = await orderModel.save();
    model.orderId = response._id;
    const client = await userModel.findById(params.clientId);
    if (!client) {
      return res.status(404).json({ message: "client not found" });
    }
    let updatedBalance;
    let calculateBalance;
    const netzoonBalance = client.netzoonBalance;
    if (
      client.userType.name == "trader" ||
      client.userType.name == "factory" ||
      client.userType.name == "local_company"
    ) {
      calculateBalance = params.subTotal - (params.subTotal * 3) / 100;
      updatedBalance = netzoonBalance + calculateBalance;
    } else {
      updatedBalance = netzoonBalance + params.subTotal;
    }

    await userModel.findByIdAndUpdate(params.clientId, {
      netzoonBalance: updatedBalance,
    });

    return model;
  } catch (error) {
    throw error;
  }
};

export const updateOrder = async (params, callBack) => {
  var model = {
    orderStatus: params.orderStatus,
  };
  Order.findByIdAndUpdate(params.orderId, model, { new: true })
    .then(response => {
      if (!response) {
        callBack("Order Update Failed");
      } else {
        if (params.orderStatus == "success") {
          const res = emptyUserCart(params.userId);
        }
        return callBack(null, response);
      }
    })
    .catch(error => {
      return callBack(error);
    });
};

export const getOrders = async (params, callBack) => {
  Order.findOne({ userId: params.userId })
    .populate({
      path: "products",
      populate: {
        path: "products",
        model: "Products",
        popualte: {
          path: "category",
          model: "DepartmentsCategory",
          select: "name",
        },
      },
    })
    .then(response => {
      return callBack(response);
    })
    .catch(err => {
      return callBack(err);
    });
};
