import mongoose from 'mongoose';



const serviceCategorySchema = new mongoose.Schema({
    title: String,
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CompanyServices',
    }]
});



export const serviceCategoryModel = mongoose.model('serviceCategory', serviceCategorySchema);