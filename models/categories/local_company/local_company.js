import mongoose from "mongoose";

const localCompanySchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    imgUrl: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    desc2: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    mail: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        required: true,
    },
    docs: {
        type: [String],
        required: true,
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'Products',
        }
    ],
    coverUrl: String,


},
    { timestamps: true }
);

export const LocalCompany = mongoose.model('LocalCompany', localCompanySchema);