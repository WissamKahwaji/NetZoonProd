import { Questions } from "../models/questions/question_model.js";

export const getQuestions = async (req, res) => {

    try {
        const data = await Questions.find({});
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

export const addQuestion = async (req, res) => {
    const { text } = req.body;
    try {
        const question = new Questions({ text });
        const savedQuestion = await question.save();
        res.status(201).json({
            message: "success",
            results: savedQuestion,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

