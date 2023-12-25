import { Openions } from "../models/openion/openion_model.js";

export const getOpenions = async (req, res) => {

    try {
        const data = await Openions.find({});
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

export const addOpenions = async (req, res) => {
    const { text } = req.body;
    try {
        const openion = new Openions({ text });
        const savedOpenion = await openion.save();
        res.status(201).json({
            message: "success",
            results: savedOpenion,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

