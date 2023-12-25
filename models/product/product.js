import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },


    name: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DepartmentsCategory',
        required: true,
    },
    condition: {
        type: String,
        enum: ['new', 'used'],
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        default : 0,
    },
    weight: {
        type: Number,
    },
    images: [String],
    vedioUrl: String,
    gifUrl: String,
    guarantee: Boolean,
    address: String,
    madeIn: String,
    year: Date,
    discountPercentage: Number,
    priceAfterDiscount: Number,
    color: String,
    country: {
        type: String,
        required: true,
    },
    ratings: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            rating: { type: Number, required: true, min: 1, max: 5 }
        }
    ],
    totalRatings: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 }
});

export const Product = mongoose.model('Products', ProductSchema);