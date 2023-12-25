import mongoose from "mongoose";

const companyCategorySchema = mongoose.Schema({

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
    phone: String,
    mobile: String,
    companies: [{
        type: {
            name: String,
            image: String,
        }
    }],
    info: {
        type: String,
        required: true,
    },
    companyimages: {
        type: [String],
        required: true,
    },
    videourl: {
        type: String,
    },
    link: String,

}, { timestamps: true });

export const CompanyCategory = mongoose.model('CompanyCategory', companyCategorySchema);