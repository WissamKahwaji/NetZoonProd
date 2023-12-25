import mongoose from "mongoose";


const TendersCategoriesSchema = mongoose.Schema({

    name: { type: String, required: true, },
    tendersItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "TendersItems",
    },]

}, { timestamps: true });



export const TendersCategories = mongoose.model('TendersCategory', TendersCategoriesSchema);