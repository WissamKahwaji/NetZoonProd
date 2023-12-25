import mongoose from "mongoose";

const VacanciesSchema = mongoose.Schema({
    companyName: {
        type: String,
        required: true,
    },
    jobName: {
        type: String,
        required: true,
    },
    jobType: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    applicantsCount: {
        type: Number,
        required: true,
        default: 0,
    },
    requirements: String,
});


export const Vacancies = mongoose.model('Vacancies', VacanciesSchema);