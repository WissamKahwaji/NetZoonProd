// import { Cart } from "../models/cart/cart_model.js";




// export const addCart = async (params, callBack) => {
//     if (!params.userId) {
//         return callBack({
//             message: "UserId Required",
//         });
//     }

//     Cart.findOne({ userId: params.userId }, function (err, cartDB) {
//         if (err) {
//             return callBack(err);
//         }
//         else {
//             if (cartDB == null) {
//                 const cartModel = new Cart({
//                     userId: params.userId,
//                     products: params.products,
//                 });

//                 cartModel.save().then((response) => {
//                     return callBack(null, response);
//                 }).catch((err) => {
//                     return callBack(err);
//                 });
//             } else if (cartDB.products.length == 0) {
//                 cartDB.products = params.products;
//                 cartDB.save();
//                 return callBack(null, cartDB);
//             } else {
//                 async.eachSeries(params.products, function (product, asyncDone) {
//                     let itemIndex = cartDB.products.findIndex(p => p.product == product.product);
//                     if (itemIndex == -1) {
//                         cartDB.products.push({
//                             product: product.product,
//                             qty: product.qty,
//                         });
//                         cartDB.save(asyncDone);
//                     } else {
//                         cartDB.products[itemIndex].qty = cartDB.products[itemIndex].qty + product.qty;
//                         cartDB.save(asyncDone);
//                     }
//                 });
//                 return callBack(null, cartDB);
//             }
//         }
//     });
// }


// export const getCart = async (params, callBack) => {
//     Cart.findOne({userId: params.userId}).populate({
//         path:"products",
//         populate : {
//             path: "product",
//             model : "Products",
//             select : 'name imageUrl price priceAfterDiscount',
//             popualte : {
//                 path : "category",
//                 model : "DepartmentsCategory",
//                 select : 'name'
//             },
//         },
//     })
//     .then((response)=>{
//         return callBack(null, response);
//     }).catch((error)=>{
//         return callBack(error);
//     });
// };

import { Cart } from "../models/cart/cart_model.js";

export const addCart = async (params) => {
    if (!params.userId) {
        throw new Error("UserId Required");
    }

    try {
        let cartDB = await Cart.findOne({ userId: params.userId });

        if (!cartDB) {
            const cartModel = new Cart({
                userId: params.userId,
                products: params.products,
            });

            cartDB = await cartModel.save();
        } else if (cartDB.products.length === 0) {
            cartDB.products = params.products;
            await cartDB.save();
        } else {
            for (const product of params.products) {
                const itemIndex = cartDB.products.findIndex(p => p.product == product.product);
                if (itemIndex === -1) {
                    cartDB.products.push({
                        product: product.product,
                        qty: product.qty,
                    });
                } else {
                    cartDB.products[itemIndex].qty += product.qty;
                }
            }
            await cartDB.save();
        }

        return cartDB;
    } catch (error) {
        throw error;
    }
}

export const getCart = async (params) => {
    try {
        const response = await Cart.findOne({ userId: params.userId })
            .populate({
                path: "products",
                populate: {
                    path: "product",
                    model: "Products",
                    select: 'name imageUrl price priceAfterDiscount category',
                    populate: {
                        path: "category",
                        model: "DepartmentsCategory",
                        select: 'name'
                    },
                },
            });
        console.log('response');
        return response;
    } catch (error) {
        throw error;
    }
};
