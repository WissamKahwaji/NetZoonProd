import userModel from "../models/userModel.js";
import { Card } from '../models/card/card.model.js';
import { addCard, createCustomer, generatePaymentIntent } from "./stripe_service.js";
import { Order } from "../models/order/order_model.js";
import { getCart } from "./cart_service.js";

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


export const createOrder = async (params) => {
    try {
        console.log('create order');
        const userDB = await userModel.findOne({ _id: params.userId }).exec();
        console.log('this is userDB');
        console.log(userDB);

        if (!userDB) {
            throw new Error('User not found');
        }

        let model = {};

        if (!userDB.stripeCustomerId) {
            const customer = await createCustomer({
                name: userDB.username,
                email: userDB.email,
            });

            userDB.stripeCustomerId = customer.id;
            await userDB.save();

            model.stripeCustomerId = customer.id;
        } else {
            model.stripeCustomerId = userDB.stripeCustomerId;
        }

        const cardDB = await Card.findOne({
            customerId: model.stripeCustomerId,
            cardNumber: params.card_Number,
            cardExpMonth: params.card_ExpMonth,
            cardExpYear: params.card_ExpYear,
        }).exec();
        console.log('cardDB');
        console.log(cardDB);
        if (!cardDB) {
            const cardResult = await addCard({
                card_Name: params.card_Name,
                card_Number: params.card_Number,
                card_ExpMonth: params.card_ExpMonth,
                card_ExpYear: params.card_ExpYear,
                card_CVC: params.card_CVC,
                customer_id: model.stripeCustomerId,
            });

            const cardModel = new Card({
                cardId: cardResult.card,
                cardName: params.card_Name,
                cardNumber: params.card_Number,
                cardExpMonth: params.card_ExpMonth,
                cardExpYear: params.card_ExpYear,
                cardCVC: params.card_CVC,
                customerId: model.stripeCustomerId,
            });

            await cardModel.save();
            model.cardId = cardResult.card;
        } else {
            model.cardId = cardDB.cardId;
        }
        console.log('generatePaymentIntent');
        const paymentIntentResult = await generatePaymentIntent({
            receipt_email: userDB.email,
            amount: params.amount,
            card_id: model.cardId,
            customer_id: model.stripeCustomerId,
        });
        console.log('generatePaymentIntent done');
        model.paymentIntentId = paymentIntentResult.id;
        model.client_secret = paymentIntentResult.client_secret;

        const cartDB = await getCart({ userId: userDB.id });

        if (!cartDB) {
            throw new Error('Cart not found');
        }

        console.log(cartDB);

        let products = [];
        let grandTotal = 0;

        cartDB.products.forEach((product) => {
            products.push({
                product: product.product._id,
                qty: product.qty,
                amount: 35,
            });
            grandTotal += product.product.priceAfterDiscount;
        });

        const orderModel = new Order({
            userId: cartDB.userId,
            products: products,
            orderStatus: 'pending',
            grandTotal: 35,
        });

        const response = await orderModel.save();
        model.orderId = response._id;

        return model;
    } catch (error) {
        throw error;
    }
};


export const updateOrder = async (params, callBack) => {
    var model = {
        orderStatus: params.status,
        transactionId: params.transaction_id
    };
    Order.findByIdAndUpdate(params.orderId, model, { useFindAndModify: false }).then((response) => {
        if (!response) {
            callBack('Order Update Failed');
        } else {
            if (params.status == 'success') {
                // Clear the cart
            }
            return callBack(null, response);
        }
    }).catch((error) => {
        return callBack(error);
    });
};

export const getOrders = async (params, callBack) => {
    Order.findOne({ userId: params.userId }).populate({
        path: 'products',
        populate: {
            path: 'products',
            model: 'Products',
            popualte: {
                path: "category",
                model: "DepartmentsCategory",
                select: 'name'
            },
        },
    }).then((response) => {
        return callBack(response);
    }).catch((err) => {
        return callBack(err);
    });
}