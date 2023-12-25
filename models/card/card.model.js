import mongoose from "mongoose";

const CardSchema = mongoose.Schema({
    cardName: {
        type: String,
        required: false,
    },
    cardNumber: {
        type: String,
        required: true,
        unique: true,
    },
    cardExpMonth: {
        type: String,
        required: true,
    },
    cardExpYear: {
        type: String,
        required: true,
    },
    cardCVC: {
        type: Number,
        required: true,
    },
    customerId: {
        type: String,
        required: true,
    },
    cardId: {
        type: String,
        required: true,
    },
}, { timestamps: true });


export const Card = mongoose.model('Card', CardSchema);