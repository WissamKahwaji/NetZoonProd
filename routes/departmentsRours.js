import express from "express";
import {
  addProduct,
  deleteProduct,
  editProduct,
  filterOnProducts,
  getAllDepartments,
  getAllDepartmentsCategories,
  getAllProducts,
  getBestDealsProducts,
  getBestDealsProductsRandomly,
  getBestOffersInDepartment,
  getBestSellingProducts,
  getCategoriesByDepartment,
  getCategoriesWithOffers,
  getLatestProducts,
  getOfferedProductsInCategory,
  getProductById,
  getProductTotalRating,
  getProductsByCategory,
  getProductsReviews,
  getSelectableProducts,
  getSelectedProductsInDepartment,
  getSimilarProducts,
  getUserProducts,
  rateProduct,
  searchProducts,
} from "../controllers/departmenst/departmentsCtrl.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/all", getAllDepartments);
router.get("/all-categories", getAllDepartmentsCategories);
router.get("/categories", getCategoriesByDepartment);
router.get("/categories-with-offers", getCategoriesWithOffers);
router.get("/categories/:id/offered-products", getOfferedProductsInCategory);
router.get("/products", getProductsByCategory);
router.get("/products/best-deals", getBestDealsProducts);
router.get("/products/best-random-deals", getBestDealsProductsRandomly);
router.get("/products/:departmentId/best-offers", getBestOffersInDepartment);
router.get("/products/best-selling", getBestSellingProducts);
router.get("/products/latest-products", getLatestProducts);
router.get("/products/similar", getSimilarProducts);
router.get("/products/search", searchProducts);
router.get(
  "/products/:departmentId/users-selected",
  getSelectedProductsInDepartment
);
router.post("/addProduct", addProduct);
router.put("/editProduct/:productId", auth, editProduct);
router.delete("/delete-product/:productId", auth, deleteProduct);
router.get("/allProducts", getAllProducts);
router.get("/getSelectableProducts", getSelectableProducts);
router.get("/getUserProducts/:userId", getUserProducts);
router.get("/filters", filterOnProducts);
router.get("/getproduct/:productId", getProductById);
router.post("/products/:id/rate", rateProduct);
router.get("/products/:id/rating", getProductTotalRating);
router.get("/products/:id/get-reviews", getProductsReviews);
export default router;
