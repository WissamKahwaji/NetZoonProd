
import mongoose from "mongoose";


const ClientOrderSchema = mongoose.Schema({
    clientId: {
        type: String,
        required: true,
    },
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
    totalQty: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

export const ClientOrders = mongoose.model('ClientOrders', ClientOrderSchema);