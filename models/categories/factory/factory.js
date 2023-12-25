import mongoose from "mongoose";

const factorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    imgurl: {
        type: String,
        required: true,
    },
},
    { timestamps: true }
);



export const Factory = mongoose.model('Factories', factorySchema);