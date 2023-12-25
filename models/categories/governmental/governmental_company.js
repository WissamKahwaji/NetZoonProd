import mongoose from "mongoose";

const governmentalCompanySchema = mongoose.Schema({
    govname: {
        type: String,
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
    images: {
        type: [String],
        required: true,
    },
    phone: String,
    mobile: String,
    info: {
        type: String,
        required: true,
    },
    videourl: {
        type: String,
    },
    link: String,

},
    { timestamps: true }
);

export const GovernmentalCompany = mongoose.model('GovernmentalCompany', governmentalCompanySchema);