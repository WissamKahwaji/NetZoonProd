import mongoose from "mongoose";

const CartSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    toJSON: {
      transform: function (model, ret) {
        ret.cartId = ret._id.toString();
        delete ret._id;
        delete ret._v;
      },
    },
  },
  {
    timestamps: true,
    strictPopulate: false,
  }
);

export const Cart = mongoose.model("Cart", CartSchema);
