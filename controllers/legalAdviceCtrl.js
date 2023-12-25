import { LegalAdvice } from "../models/legal_advices/legalAdviceModel.js";


export const getLegalAdvices = async (req, res) => {

    try {
        const data = await LegalAdvice.find({});
        if (!data) {
            return res.status(404).json({ message: 'no Data Found' });
        }
        return res.json({
            message: "success",
            results: data,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

