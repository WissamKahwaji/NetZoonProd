import mongoose from "mongoose";

const customsSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true,
    },

    imageUrl: {
        type: String,
        required: true,
    },
    customsplaces: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'customscategories',
        default: []
    }],

}, { timestamps: true });

export const Customs = mongoose.model('Customs', customsSchema);