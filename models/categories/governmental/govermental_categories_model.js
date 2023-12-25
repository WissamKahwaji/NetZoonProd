import mongoose from "mongoose";

const govermentalCategoriesSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    images: [
        { type: String, required: true },
    ],

    govermentalDetails: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Governmental',
    }
});



export const GovernmentalCategory = mongoose.model('GovermentalCategories', govermentalCategoriesSchema);