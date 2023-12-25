import mongoose from "mongoose";

const vehicleCompanySchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['cars', 'planes']
    },
    imgUrl: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    mail: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        required: true,
    },
    vehicles: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'Vehicles',
            default: []
        }
    ],
    coverUrl: String,


},
    { timestamps: true }
);

export const VehicleCompany = mongoose.model('VehicleCompany', vehicleCompanySchema);