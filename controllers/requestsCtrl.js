import { RequestsModel } from "../models/requests/request_model.js";



export const getRequests = async (req, res) => {
    try {
        const data = await RequestsModel.find({});
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


export const addRequest = async (req, res) => {
    const { address, text } = req.body;
    try {
        const request = new RequestsModel({ address, text });
        const savedRequest = await request.save();
        res.status(201).json({
            message: "success",
            results: savedRequest,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}