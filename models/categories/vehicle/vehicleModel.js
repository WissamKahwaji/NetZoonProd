import mongoose from "mongoose";

const VehicleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    kilometers: {
      type: Number,
    },
    year: Date,

    location: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    carImages: {
      type: [String],
    },
    vedioUrl: String,
    contactNumber: String,
    exteriorColor: String,
    interiorColor: String,
    doors: Number,
    bodyCondition: String,
    bodyType: String,
    mechanicalCondition: String,
    seatingCapacity: Number,
    numofCylinders: Number,
    transmissionType: String,
    horsepower: String,
    fuelType: String,
    extras: String,
    technicalFeatures: String,
    steeringSide: String,
    guarantee: Boolean,
    forWhat: String,
    regionalSpecs: String,

    country: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Vehicle = mongoose.model("Vehicles", VehicleSchema);
