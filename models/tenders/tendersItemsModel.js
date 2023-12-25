import mongoose from "mongoose";

const TendersItemsSchema = mongoose.Schema({

    nameAr: { type: String, required: true, },
    nameEn: { type: String, required: true, },
    companyName: { type: String, required: true, },
    startDate: { type: Date, required: true, },
    endDate: { type: Date, required: true, },
    price: { type: Number, required: true, min: 1 },
    imageUrl: { type: String, required: true, },
    // value: { type: Number, required: true, min: 1 },
    category: { type: String, required: true },

}, { timestamps: true });



export const TendersItems = mongoose.model('TendersItems', TendersItemsSchema);