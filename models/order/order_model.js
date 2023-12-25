import mongoose from "mongoose";


const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Products",
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
            qty: {
                type: Number,
                required: true,
            },
        }
    ],
    grandTotal: {
        type: Number,
        required: true,
    },
    orderStatus: {
        type: String,
        required: true,
    },
    transactionId: {
        type: String,
    },
    orderEvent: {
        type: String,
    },
    shippingAddress: {
        type: String,
    },
    mobile: {
        type: String,
    },
    subTotal: {
        type: Number,
    },
    serviceFee: {
        type: Number,
    },
},
    {
        timestamps: true,
    }
);



export const Order = mongoose.model('Orders', orderSchema);