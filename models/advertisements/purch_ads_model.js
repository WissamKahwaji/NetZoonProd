import mongoose from "mongoose";


const purchAdsSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    ads: [
        {
            ads: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Advertisements",
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
    shippingAddress: {
        type: String,
    },
    mobile: {
        type: String,
    },
},
    {
        timestamps: true,
    }
);



export const PurchAds = mongoose.model('PurchAds', purchAdsSchema);