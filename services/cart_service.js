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

export const addCart = async params => {
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
        const itemIndex = cartDB.products.findIndex(
          p => p.product == product.product
        );
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
};

export const addToCart = async params => {
  try {
    const { userId, productId, quantity } = params;

    // Find the cart for the user
    let cart = await Cart.findOne({ userId });

    // If cart doesn't exist, create a new one
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    // Check if the product already exists in the cart
    const existingProductIndex = cart.products.findIndex(item =>
      item.product.equals(productId)
    );

    // If the product exists, update its quantity
    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].qty += quantity;
    } else {
      // If the product doesn't exist, add it to the cart
      cart.products.push({ product: productId, qty: quantity });
    }

    // Save the updated cart
    const updatedCart = await cart.save();

    return updatedCart;
  } catch (error) {
    throw error;
  }
};
export const updateCart = async params => {
  try {
    const { userId, productId, quantity, deleteItem } = params;

    // Find the cart for the user
    let cart = await Cart.findOne({ userId });

    // If cart doesn't exist, create a new one
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    // Check if the product already exists in the cart
    const existingProductIndex = cart.products.findIndex(item =>
      item.product.equals(productId)
    );

    // If the product exists, update its quantity or remove it based on deleteItem flag
    if (existingProductIndex !== -1) {
      if (deleteItem) {
        cart.products.splice(existingProductIndex, 1); // Remove the product from the cart
      } else {
        if (quantity === 0) {
          cart.products.splice(existingProductIndex, 1); // Remove the product from the cart if quantity is 0
        } else {
          cart.products[existingProductIndex].qty = quantity; // Update the quantity
        }
      }
    } else {
      // If the product doesn't exist and quantity is greater than 0, add it to the cart
      if (!deleteItem && quantity > 0) {
        cart.products.push({ product: productId, qty: quantity });
      }
    }

    // Save the updated cart
    const updatedCart = await cart.save();

    return updatedCart;
  } catch (error) {
    throw error;
  }
};
export const clearCart = async userId => {
  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      cart.products = [];
      await cart.save();
    }

    return { message: "Cart cleared successfully" };
  } catch (error) {
    throw error;
  }
};
export const getCart = async params => {
  try {
    const response = await Cart.findOne({ userId: params.userId }).populate({
      path: "products",
      populate: {
        path: "product",
        model: "Products",
        select: "name imageUrl price priceAfterDiscount category",
        populate: {
          path: "category",
          model: "DepartmentsCategory",
          select: "name",
        },
      },
    });
    console.log("response");
    return response;
  } catch (error) {
    throw error;
  }
};

export const emptyUserCart = async params => {
  try {
    const cart = await Cart.findOne({ userId: params });

    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.products = [];
    const response = await cart.save();
    return response;
  } catch (error) {
    throw error;
  }
};
