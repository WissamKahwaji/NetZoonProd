import mongoose from "mongoose";

const customscategoriesSchema = mongoose.Schema({

    categoryName: {
        type: String,
        required: true,
        // unique: true,
    },

    name: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    imgurl: {
        type: String,
        required: true,
    },
    info: {
        type: String,
        required: true,
    },
    companyimages: {
        type: [String],
        required: true,
    },
    link: {
        type: String,
    },
    videourl: {
        type: String,
    },

}, { timestamps: true });

export const customscategories = mongoose.model('customscategories', customscategoriesSchema);