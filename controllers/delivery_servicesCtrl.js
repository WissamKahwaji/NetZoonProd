import { DeliveryServices } from "../models/delivery_services/delivery_service_model.js";




export const getDeliveryCompanyServices = async (req, res) => {
    try {

        const { id } = req.params;
        const services = await DeliveryServices.find({ owner: id }).populate('owner', 'username');
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addDeliveryService = async (req, res) => {
    try {

        const { title, description, from, to, price, owner } = req.body;
        const newService = new DeliveryServices({
            title,
            description,
            from,
            to,
            price,
            owner,
        });
        const savedService = await newService.save();
        res.status(201).json('The service has been added successfully');

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};