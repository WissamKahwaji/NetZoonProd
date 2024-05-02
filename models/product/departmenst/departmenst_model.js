import mongoose from "mongoose";

const DepartmentsSchema = mongoose.Schema({
  name: { type: String, required: true },
  imagePath: String,
  departmentsCategory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DepartmentsCategory",
    },
  ],
});

export const Departments = mongoose.model("Departments", DepartmentsSchema);
