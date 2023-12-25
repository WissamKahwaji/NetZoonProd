import express from "express";
import { check } from "express-validator";
import {
  createCategory,
  createfreezoon,
  getAllCategories,
  getAllFactories,
  getAllFactoriesCategories,
  getCustomsCategory,
  getFreezoon,
  getAllLocalCompanies,
  getLocalCompanyProducts,
  getLocalCompanyById,
  getAllCars,
  getAllPlans,
  createVehicle,
  getVehicleById,
  getCustoms,
  getCustomsById,
  getFactoryById,
  getFreezoonById,
  getAllUsedPlans,
  getAllNewPlans,
  getGovermental,
  getGovermentalById,
  getCarsCompanies,
  getPlanesCompanies,
  getCompaniesVehicles,
  getLatestCarsByCreator,
  getSeaCompanies,
  editVehicle,
  deleteVehicle,
  resetVehicleCount,
} from "../controllers/categories.js";
import auth from "../middlewares/auth.js";
import {
  addCompanyService,
  deleteCompanyService,
  editCompanyService,
  getCompanyServices,
  getServiceById,
  getServicesByCategories,
  getServicesCategories,
  getTotalRating,
  rateCompanyService,
} from "../controllers/company_serviceCtrl.js";

const router = express.Router();

router.get("/get-categories", getAllCategories);
router.post(
  "/create-category",
  auth,
  [
    check("url").not().isEmpty().withMessage("url cannot be empty"),
    check("name").not().isEmpty().withMessage("name cannot be empty"),
  ],
  createCategory
);
//Free Zone routes
router.get("/freezoon", getFreezoon);
router.post("/create-freezoon", createfreezoon);
router.get("/freezoon/:id", getFreezoonById);

//Factories routes
router.get("/factories", getAllFactoriesCategories);
router.get("/get-all-factories/:id", getAllFactories);
router.get("/factory/:id", getFactoryById);

//Custom routes
router.get("/get-customs-categories", getCustomsCategory);
router.get("/get-customs", getCustoms);
router.get("/customs/:id", getCustomsById);

//local company routes
router.get("/local-company", getAllLocalCompanies);
router.get("/local-company/:id", getLocalCompanyById);
router.get("/local-company/get-products/:id", getLocalCompanyProducts);
router.get("/local-company/get-services/:id", getCompanyServices);
router.get("/services-categories", getServicesCategories);
router.get("/services-by-category", getServicesByCategories);
router.get("/local-company/get-service/:id", getServiceById);
router.post("/local-company/add-service", addCompanyService);
router.put("/local-company/edit-service/:id", editCompanyService);
router.delete("/local-company/service/:id", deleteCompanyService);
router.post("/local-company/services/:id/rate", rateCompanyService);
router.get("/local-company/services/:id/rating", getTotalRating);
//govermental routes

router.get("/govermental", getGovermental);
router.get("/govermental/:id", getGovermentalById);

//Cars routes
router.get("/cars", getAllCars);
router.get("/cars-companies", getCarsCompanies);
router.get("/latest-cars-by-creator", getLatestCarsByCreator);

//Plans routes
router.get("/planes", getAllPlans);
router.get("/planes/getoldplanes", getAllUsedPlans);
router.get("/planes/getnewplanes", getAllNewPlans);
router.get("/planes-companies", getPlanesCompanies),
  router.get("/sea-companies", getSeaCompanies),
  router.post("/vehicle/create-vehicle", createVehicle);
router.put("/vehicle/edit-vehicle/:id", editVehicle);
router.delete("/vehicle/:id", deleteVehicle);
router.get("/vehicle/:id", getVehicleById);
router.get("/company-vehicles/:id", getCompaniesVehicles);
router.put("/reset-vehicle-count/:userId", resetVehicleCount);

export default router;
