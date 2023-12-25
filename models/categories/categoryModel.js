import mongoose from "mongoose";

const categorySchema = mongoose.Schema({

    url: {
        type: String,
        required: true,
        default: "",
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },


}, { timestamps: true });

export const Category = mongoose.model('Categories', categorySchema);