import mongoose from "mongoose";

const freezoonSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true,
    },

    imageUrl: {
        type: String,
        required: true,
    },
    freezoonplaces: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'CompanyCategory',
        default: []
    }],

}, { timestamps: true });

export const Freezoon = mongoose.model('Freezoon', freezoonSchema);