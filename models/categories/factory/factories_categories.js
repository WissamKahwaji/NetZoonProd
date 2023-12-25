import mongoose from "mongoose";

const factoriesCategoriesSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    factory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ]
},
    { timestamps: true }
);



export const FactoryCategories = mongoose.model('FactoriesCategories', factoriesCategoriesSchema);