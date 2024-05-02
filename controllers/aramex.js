import axios from "axios";

const aramexApiUrl =
  "https://ws.aramex.net/ShippingAPI.V2/RateCalculator/Service_1_0.svc/json/CalculateRate";

const pickUpUrl =
  "https://ws.aramex.net/ShippingAPI.V2/Shipping/Service_1_0.svc/json/CreatePickup";
const shipmentUrl =
  "https://ws.aramex.net/ShippingAPI.V2/Shipping/Service_1_0.svc/json/CreateShipments";

const fetchCitiesUrl =
  "https://ws.aramex.net/ShippingAPI.V2/Location/Service_1_0.svc/json/FetchCities";

const trackPickupUrl =
  "https://ws.aramex.net/ShippingAPI.V2/Tracking/Service_1_0.svc/json/TrackPickup";

const trackShipmentsUrl =
  "https://ws.aramex.net/ShippingAPI.V2/Tracking/Service_1_0.svc/json/TrackShipments";

const clientInfo = {
  Source: 24,
  AccountCountryCode: "AE",
  AccountEntity: "DXB",
  AccountPin: "906169",
  AccountNumber: "71923340",
  UserName: "netzoon.2023@gmail.com",
  Password: "Netzoon@123@aramex",
  Version: "v1",
};

export const calculateRateController = async (req, res) => {
  try {
    const {
      originAddress,
      destinationAddress,
      shipmentDetails,
      preferredCurrencyCode,
    } = req.body;
    const requestBody = {
      OriginAddress: originAddress,
      DestinationAddress: destinationAddress,
      ShipmentDetails: shipmentDetails,
      PreferredCurrencyCode: preferredCurrencyCode,
      ClientInfo: clientInfo,
      Transaction: null,
    };

    const response = await axios.post(aramexApiUrl, requestBody);

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const createPickUpController = async (req, res) => {
  try {
    const { labelInfo, pickup, transaction } = req.body;
    const requestBody = {
      ClientInfo: clientInfo,
      LabelInfo: labelInfo,
      Pickup: pickup,
      Transaction: transaction,
    };

    // Make a POST request to the Aramex API
    const response = await axios.post(pickUpUrl, requestBody);

    // Send the Aramex API response back to the client
    res.json(response.data);
  } catch (error) {
    // Handle errors
    console.error("Error:", error.message);
    res.status(500).json({ error: error });
  }
};

export const createShipmentController = async (req, res) => {
  try {
    const { shipments, labelInfo, transaction } = req.body;
    const requestBody = {
      Shipments: shipments,
      LabelInfo: labelInfo,
      ClientInfo: clientInfo,
      Transaction: transaction,
    };

    // Make a POST request to the Aramex API
    const response = await axios.post(shipmentUrl, requestBody);

    // Send the Aramex API response back to the client
    res.json(response.data);
  } catch (error) {
    // Handle errors
    console.error("Error:", error.message);
    res.status(500).json({ error: error });
  }
};

export const fetchCities = async (req, res) => {
  try {
    // Get the request body from the client
    const { countryCode } = req.query;
    const requestBody = {
      ClientInfo: clientInfo,
      CountryCode: countryCode,
      NameStartsWith: "",
      State: "",
      Transaction: {
        Reference1: "",
        Reference2: "",
        Reference3: "",
        Reference4: "",
        Reference5: "",
      },
    };
    // Make a POST request to the Aramex API
    const response = await axios.post(fetchCitiesUrl, requestBody);

    // Send the Aramex API response back to the client
    res.json(response.data);
  } catch (error) {
    // Handle errors
    console.error("Error:", error.message);
    res.status(500).json({ error: error });
  }
};

export const trackPickup = async (req, res) => {
  try {
    const { reference, transaction } = req.body;
    const requestBody = {
      ClientInfo: clientInfo,
      Reference: reference,
      Transaction: transaction,
    };
    const response = await axios.post(trackPickupUrl, requestBody);
    res.json(response.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error });
  }
};

export const trackShipments = async (req, res) => {
  try {
    const { shipments, getLastTrackingUpdateOnly, transaction } = req.body;
    const requestBody = {
      Shipments: shipments,
      GetLastTrackingUpdateOnly: getLastTrackingUpdateOnly,
      ClientInfo: clientInfo,
      Transaction: transaction,
    };
    const response = await axios.post(trackShipmentsUrl, requestBody);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error });
  }
};
