import express from "express";
import { check } from "express-validator";
import {
  EditUser,
  addAccount,
  addNumberOfVisitors,
  addProductToFavorites,
  addProductsToSelectedProducts,
  changeAccount,
  changePassword,
  clearFav,
  deleteAccount,
  deleteProductFromSelectedProducts,
  deleteUser,
  getAccountByEmail,
  getAllFavorites,
  getAllUsers,
  getSelectedProducts,
  getUserById,
  getUserByType,
  getUserFollowers,
  getUserFollowings,
  getUserTotalRating,
  getVisitors,
  oAuthSignIn,
  otpLogin,
  rateUser,
  removeProductFromFavorites,
  signUp,
  signin,
  toggleFollow,
  verifyOTPLogin,
} from "../controllers/userCtrl.js";
import { stripeAccount } from "../services/stripe_service.js";

const router = express.Router();

const userType = [
  "local_company",
  "user",
  "freezone",
  "factory",
  "car",
  "planes",
  "sea_companies",
  "news_agency",
  "real_estate",
  "trader",
  "delivery_company",
];

router.post(
  "/register",
  [
    check("email").isEmail().withMessage("Please enter a valid email address"),
    check("password")
      .trim()
      .isLength({ min: 8 })
      .not()
      .isEmpty()
      .withMessage("Please enter a valid email address"),
    check("username").trim().not().isEmpty(),
    check("userType")
      .isIn(userType)
      .withMessage("userType value must be one of: " + userType.join(", ")),
    check("isFreeZoon")
      .isBoolean()
      .withMessage("isFreeZoon must be a boolean value"),
  ],
  signUp
);
router.post(
  "/signin",
  [
    check("email").isEmail().withMessage("Please enter a valid email address"),
    check("password")
      .trim()
      .isLength({ min: 8 })
      .not()
      .isEmpty()
      .withMessage("Please enter a valid email address"),
  ],
  signin
);
router.post("/oauth", oAuthSignIn);
router.post("/changeAccount", changeAccount);

router.put("/password/:userId", changePassword);
router.delete("/delete-user/:userId", deleteAccount);
router.post("/otpLogin", otpLogin);
router.post("/verifyOtpLogin", verifyOTPLogin);

router.put("/editUser/:userId", EditUser);
router.get("/getuseraccounts", getAccountByEmail);
router.post("/addaccount", addAccount);

router.post("/favorites/add", addProductToFavorites);
router.post("/favorites/remove", removeProductFromFavorites);
router.post("/favorites/clear", clearFav);
router.get("/favorites/:userId", getAllFavorites);
router.get("/getUser/:userId", getUserById);
router.get("/getUserByType", getUserByType);
router.get("/getSelectedProducts/:userId", getSelectedProducts);
router.post("/addToSelectedProducts/:userId", addProductsToSelectedProducts);
router.delete(
  "/deleteFromSelectedProducts/:userId/:productId",
  deleteProductFromSelectedProducts
);

router.put("/toggleFollow/:otherUserId", toggleFollow);
router.get("/getUserFollowings/:userId", getUserFollowings);
router.get("/getUserFollowers/:userId", getUserFollowers);

router.post("/:userId/addvisitor", addNumberOfVisitors);
router.get("/:id/visitors", getVisitors);
router.post("/:id/rate", rateUser);
router.get("/:id/rating", getUserTotalRating);
router.delete("/net-remove/:id", deleteUser);
router.get("/get-all-users", getAllUsers);

router.get("/api/stripe/account", stripeAccount);

export default router;
