import mongoose from "mongoose";


const govermentalSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    imageUrl: {
        type: String,
        required: true,
    },
    govermentalCompanies: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'GovernmentalCompany',
        default: []
    }],
});

export const Governmental = mongoose.model('govermental', govermentalSchema);