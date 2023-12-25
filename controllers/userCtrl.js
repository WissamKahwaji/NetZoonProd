import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import otpGenerator from "otp-generator";
import crypto from "crypto";
import Nexmo from "nexmo";
import mongoose from "mongoose";
import { Account } from "../models/account/account_model.js";
import { FactoryCategories } from "../models/categories/factory/factories_categories.js";
import { Product } from "../models/product/product.js";
import { DepartmentsCategory } from "../models/product/departmenst/categories/departments_categories_model.js";
import { Advertisement } from "../models/advertisements/advertisementsModel.js";
import { CompanyServices } from "../models/company_services/company_service_model.js";
import { serviceCategoryModel } from "../models/company_services/service_category_model.js";
import { Vehicle } from "../models/categories/vehicle/vehicleModel.js";
import { RealEstate } from "../models/real_estate/real_estate_model.js";
import { News } from "../models/news/newsModel.js";
import { Comment } from "../models/news/comment_model.js";
import { DealsItems } from "../models/deals/dealsItemsModel.js";
import { DealsCategories } from "../models/deals/dealsCategoriesModel.js";
// import passport from "passport";
// var GoogleStrategy = require("passport-google-oauth2").Strategy;

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://yourdomain:3000/auth/google/callback",
//       passReqToCallback: true,
//     },
//     function (request, accessToken, refreshToken, profile, done) {
//       User.findOrCreate({ googleId: profile.id }, function (err, user) {
//         return done(err, user);
//       });
//     }
//   )
// );
const nexmo = new Nexmo({
  apiKey: "7e88bc5b",
  apiSecret: "6W60UQDnogslVCuP",
});

const key = "otp-secret-key";

// const QB = QuickBlox({
//     appId: '101248',
//     authKey: '7QsUQCOppNXAmTq',
//     authSecret: 's4XksyBADdYYkPa',
//     accountKey: '6Ks95ZqZu8PNbwv4Yvz9'
// });

// QB.init('101248', '7QsUQCOppNXAmTq', 's4XksyBADdYYkPa', '6Ks95ZqZu8PNbwv4Yvz9');

export const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(404).json({
      success: false,
      message: "Invalid email or password",
    });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (!existingUser)
      return res.status(401).json({ message: "User doesn't exist." });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    // existingUser = existingUser.select('-password');
    res.status(200).json({
      result: existingUser,
      message: "LogIn Successfuled",
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const oAuthSignIn = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      const {
        username,
        profilePhoto,
        userType,
        firstMobile,
        secondeMobile,
        thirdMobile,
        isFreeZoon,
        isService,
        isSelectable,
        freezoneCity,
        deliverable,
        subcategory,
        address,
        website,
        link,
        slogn,
        businessLicense,
        companyProductsNumber,
        sellType,
        toCountry,
        bio,
        description,
        isThereWarehouse,
        isThereFoodsDelivery,
        deliveryType,
        deliveryCarsNum,
        deliveryMotorsNum,
        profitRatio,
        city,
        addressDetails,
        contactName,
        floorNum,
        locationType,
        title,
        country,
      } = req.body;
      const coverPhoto = req.files["coverPhoto"]
        ? req.files["coverPhoto"][0]
        : null;
      const frontIdPhoto = req.files["frontIdPhoto"]
        ? req.files["frontIdPhoto"][0]
        : null;
      const backIdPhoto = req.files["backIdPhoto"]
        ? req.files["backIdPhoto"][0]
        : null;
      const tradeLicensePhoto = req.files["tradeLicensePhoto"]
        ? req.files["tradeLicensePhoto"][0]
        : null;
      const deliveryPermitPhoto = req.files["deliveryPermitPhoto"]
        ? req.files["deliveryPermitPhoto"][0]
        : null;

      const coverUrlImage = coverPhoto
        ? "https://back.netzoon.com/" + coverPhoto.path.replace(/\\/g, "/")
        : "https://i.imgur.com/EOWYmuQ.png";

      const frontIdPhotoUrlImage = frontIdPhoto
        ? "https://back.netzoon.com/" + frontIdPhoto.path.replace(/\\/g, "/")
        : null;
      const backIdPhotoUrlImage = backIdPhoto
        ? "https://back.netzoon.com/" + backIdPhoto.path.replace(/\\/g, "/")
        : null;
      const tradeLicensePhotoUrl = tradeLicensePhoto
        ? "https://back.netzoon.com/" +
          tradeLicensePhoto.path.replace(/\\/g, "/")
        : null;
      const deliveryPermitPhotoUrl = deliveryPermitPhoto
        ? "https://back.netzoon.com/" +
          deliveryPermitPhoto.path.replace(/\\/g, "/")
        : null;

      const newUser = await userModel.create({
        username,
        email,
        userType,
        firstMobile,
        secondeMobile,
        thirdMobile,
        freezoneCity: freezoneCity,
        subcategory,
        address,
        businessLicense,
        companyProductsNumber,
        sellType,
        toCountry,
        bio,
        description,
        website: website,
        slogn: slogn,
        link: link,
        profilePhoto: profilePhoto,
        coverPhoto: coverUrlImage,

        frontIdPhoto: frontIdPhotoUrlImage,
        backIdPhoto: backIdPhotoUrlImage,
        tradeLicensePhoto: tradeLicensePhotoUrl,
        deliveryPermitPhoto: deliveryPermitPhotoUrl,
        country: country,

        deliveryType: deliveryType,
        deliveryCarsNum: deliveryCarsNum,
        deliveryMotorsNum: deliveryMotorsNum,
        profitRatio: profitRatio,
        city: city,
        addressDetails: addressDetails,
        contactName: contactName,
        floorNum: floorNum,
        locationType: locationType,
      });
      newUser.isFreeZoon = isFreeZoon ?? false;
      newUser.isService = isService ?? false;
      newUser.isSelectable = isSelectable ?? false;
      newUser.deliverable = deliverable ?? false;
      newUser.isThereWarehouse = isThereWarehouse ?? false;
      newUser.isThereFoodsDelivery = isThereFoodsDelivery ?? false;

      if (userType == "car" || "planes" || "sea_companies" || "real_estate") {
        const subscriptionExpireDate = new Date();
        subscriptionExpireDate.setDate(subscriptionExpireDate.getDate() + 30);
        newUser.subscriptionExpireDate = subscriptionExpireDate;
        newUser.save();
      }

      if (userType === "factory") {
        const factoryCategory = await FactoryCategories.findOneAndUpdate(
          { title: title }, // Update this condition based on your requirements
          { $push: { factory: newUser._id } },
          { new: true }
        );

        // Handle case when FactoryCategories document doesn't exist
        if (!factoryCategory) {
          // Create a new FactoryCategories document
          await FactoryCategories.create({
            title: title,
            factory: [newUser._id],
          });
        }
      }
      const token = jwt.sign(
        { email: newUser.email, id: newUser._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );

      return res.status(201).json({
        result: newUser,
        message: "User created",
        token: token,
      });
    } else {
      const token = jwt.sign(
        { email: existingUser.email, id: existingUser._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );
      console.log(existingUser);
      res.status(201).json({
        result: existingUser,
        message: "LogIn Successfuled",
        token: token,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const changeAccount = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(404).json({
      success: false,
      message: "Invalid email or password",
    });
  }
  try {
    const existingUser = await userModel.findOne({ email, password: password });
    if (!existingUser)
      return res.status(401).json({ message: "User doesn't exist." });
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    res.status(200).json({
      result: existingUser,
      message: "LogIn Successfuled",
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Handle user registration
export const signUp = async (req, res) => {
  try {
    const { country } = req.body;
    const {
      username,
      email,
      password,
      userType,
      firstMobile,
      secondeMobile,
      thirdMobile,
      isFreeZoon,
      isService,
      isSelectable,
      freezoneCity,
      deliverable,
      subcategory,
      address,
      website,
      link,
      slogn,
      businessLicense,
      companyProductsNumber,
      sellType,
      toCountry,
      bio,
      description,
      isThereWarehouse,
      isThereFoodsDelivery,
      deliveryType,
      deliveryCarsNum,
      deliveryMotorsNum,
      profitRatio,
      city,
      addressDetails,
      contactName,
      floorNum,
      locationType,
      withAdd,
      mainAccount,
    } = req.body;
    const { title } = req.body;
    const profilePhoto = req.files["profilePhoto"]
      ? req.files["profilePhoto"][0]
      : null;
    const bannerPhoto = req.files["bannerPhoto"]
      ? req.files["bannerPhoto"][0]
      : null;
    const coverPhoto = req.files["coverPhoto"]
      ? req.files["coverPhoto"][0]
      : null;
    const frontIdPhoto = req.files["frontIdPhoto"]
      ? req.files["frontIdPhoto"][0]
      : null;
    const backIdPhoto = req.files["backIdPhoto"]
      ? req.files["backIdPhoto"][0]
      : null;

    const tradeLicensePhoto = req.files["tradeLicensePhoto"]
      ? req.files["tradeLicensePhoto"][0]
      : null;
    const deliveryPermitPhoto = req.files["deliveryPermitPhoto"]
      ? req.files["deliveryPermitPhoto"][0]
      : null;

    const error = validationResult(req);
    if (!error.isEmpty()) {
      console.log(error);
      return res.status(401).json(error);
    }

    const profileUrlImage = profilePhoto
      ? "https://back.netzoon.com/" + profilePhoto.path.replace(/\\/g, "/")
      : "https://i.imgur.com/hnIl9uM.jpg";
    const coverUrlImage = coverPhoto
      ? "https://back.netzoon.com/" + coverPhoto.path.replace(/\\/g, "/")
      : "https://i.imgur.com/EOWYmuQ.png";
    const banerUrlImage = bannerPhoto
      ? "https://back.netzoon.com/" + bannerPhoto.path.replace(/\\/g, "/")
      : null;
    const frontIdPhotoUrlImage = frontIdPhoto
      ? "https://back.netzoon.com/" + frontIdPhoto.path.replace(/\\/g, "/")
      : null;
    const backIdPhotoUrlImage = backIdPhoto
      ? "https://back.netzoon.com/" + backIdPhoto.path.replace(/\\/g, "/")
      : null;
    const tradeLicensePhotoUrl = tradeLicensePhoto
      ? "https://back.netzoon.com/" + tradeLicensePhoto.path.replace(/\\/g, "/")
      : null;
    const deliveryPermitPhotoUrl = deliveryPermitPhoto
      ? "https://back.netzoon.com/" +
        deliveryPermitPhoto.path.replace(/\\/g, "/")
      : null;

    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      console.log("errrrrrrrrrror");
      return res
        .status(422)
        .json({ message: "User already exists, please login!" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await userModel.create({
      // quickbloxId: result.id,
      username,
      email,
      password: hashedPassword,
      userType,
      firstMobile,
      secondeMobile,
      thirdMobile,

      freezoneCity: freezoneCity,

      subcategory,
      address,
      businessLicense,
      companyProductsNumber,
      sellType,
      toCountry,
      bio,
      description,
      website: website,
      slogn: slogn,
      link: link,
      profilePhoto: profileUrlImage,
      coverPhoto: coverUrlImage,
      banerPhoto: banerUrlImage,
      frontIdPhoto: frontIdPhotoUrlImage,
      backIdPhoto: backIdPhotoUrlImage,
      tradeLicensePhoto: tradeLicensePhotoUrl,
      deliveryPermitPhoto: deliveryPermitPhotoUrl,
      country: country,

      deliveryType: deliveryType,
      deliveryCarsNum: deliveryCarsNum,
      deliveryMotorsNum: deliveryMotorsNum,
      profitRatio: profitRatio,
      city: city,
      addressDetails: addressDetails,
      contactName: contactName,
      floorNum: floorNum,
      locationType: locationType,
    });
    if (isFreeZoon) {
      newUser.isFreeZoon = isFreeZoon ?? false;
    }
    if (isService) {
      newUser.isService = isService ?? false;
    }

    if (isSelectable) {
      newUser.isSelectable = isSelectable ?? false;
    }
    if (deliverable) {
      newUser.deliverable = deliverable ?? false;
    }
    if (isThereWarehouse) {
      newUser.isThereWarehouse = isThereWarehouse ?? false;
    }
    if (isThereFoodsDelivery) {
      newUser.isThereFoodsDelivery = isThereFoodsDelivery ?? false;
    }

    if (userType == "car" || "planes" || "sea_companies" || "real_estate") {
      const subscriptionExpireDate = new Date();
      subscriptionExpireDate.setDate(subscriptionExpireDate.getDate() + 30);
      newUser.subscriptionExpireDate = subscriptionExpireDate;
      newUser.save();
    }
    // const account = await Account.create({ user: newUser._id });
    // newUser.accounts.push(account._id);
    // await newUser.save();

    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    if (userType === "factory") {
      const factoryCategory = await FactoryCategories.findOneAndUpdate(
        { title: title }, // Update this condition based on your requirements
        { $push: { factory: newUser._id } },
        { new: true }
      );

      // Handle case when FactoryCategories document doesn't exist
      if (!factoryCategory) {
        // Create a new FactoryCategories document
        await FactoryCategories.create({
          title: title,
          factory: [newUser._id],
        });
      }
    }

    console.log("1111111111");
    console.log(withAdd);
    if (withAdd || withAdd == true) {
      console.log("222222222");
      const existingUser = await userModel.findOne({ email: mainAccount });

      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      console.log("33333333333");
      existingUser.accounts.push(newUser._id);
      console.log(existingUser.accounts);
      newUser.accounts.push(existingUser._id);
      await existingUser.save();
      await newUser.save();
    }
    console.log("succccccccccccccccccccccccc");
    return res.status(201).json({
      result: newUser,
      message: "User created",
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error in registration" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error on get all users" });
  }
};

export const addAccount = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const newUser = await userModel.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(password, newUser.password);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid credentials" });

    if (existingUser.accounts.includes(newUser._id)) {
      return res.status(409).json({ message: "User already has this account" });
    }

    // Create a new account and associate it with the user
    // const account = await Account.create({ user: existingUser._id });

    existingUser.accounts.push(newUser._id);
    newUser.accounts.push(existingUser._id);
    await existingUser.save();
    await newUser.save();
    res.status(201).json(existingUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating account" });
  }
};

export const getAccountByEmail = async (req, res) => {
  const { email } = req.query;

  try {
    const user = await userModel.findOne({ email }).populate("accounts");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const accounts = user.accounts;

    res.status(200).json(accounts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving accounts" });
  }
};

export const changePassword = async (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json("Password changed successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in changing password" });
  }
};

export const createOtp = async (params, callback) => {
  const otp = otpGenerator.generate(4, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const ttl = 5 * 60 * 1000;
  const expires = Date.now() + ttl;
  const data = `${params.phone}.${otp}.${expires}`;
  const hash = crypto.createHmac("sha256", key).update(data).digest("hex");
  const fullHash = `${hash}.${expires}`;

  console.log(`Your Otp is ${otp}`);

  //Send SMS
  const from = "+971542451874";
  const to = "+971508426896";
  const text = "Hello, this is a test SMS message!";
  nexmo.message.sendSms(from, to, text, (err, responseData) => {
    if (err) {
      console.log("Error:", err);
    } else {
      console.log("Message sent successfully:", responseData);
    }
  });

  return callback(null, fullHash);
};

export const verifyOTP = async (params, callback) => {
  let [hashValue, expires] = params.hash.split(".");

  let now = Date.now();
  if (now > parseInt(expires)) return callback("OTP expired");

  let data = `${params.phone}.${params.otp}.${expires}`;
  let newCalculateHash = crypto
    .createHmac("sha256", key)
    .update(data)
    .digest("hex");

  if (newCalculateHash === hashValue) {
    return callback(null, "Success");
  } else {
    return callback("Invalid OTP");
  }
};

export const otpLogin = async (req, res) => {
  createOtp(req.body, (error, results) => {
    if (error) {
      res.status(500).json({ message: "Error in registration" });
    }
    return res.status(200).json({
      message: "Success",
      data: results,
    });
  });
};

export const verifyOTPLogin = async (req, res) => {
  verifyOTP(req.body, (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Invalid OTP" }); // Return the response and exit the function
    }
    return res.status(200).json({
      message: "Success",
      data: results,
    });
  });
};

export const addProductToFavorites = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    console.error("11111111");
    // Find the user by userId
    const user = await userModel.findById(userId);
    console.error("22222222");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.error("3333333333");
    // Check if the product already exists in the favorites list
    const isProductInFavorites = user.favorites.products.find(
      item => item.productId.toString() === productId
    );
    console.error("4444444444");
    if (isProductInFavorites) {
      return res.status(400).json({ message: "Product already in favorites" });
    }
    console.error("5555555555");
    // Add the product to the favorites list
    user.favorites.products.push({ productId });
    console.error("6666666666");
    // Save the updated user
    await user.save();

    res.status(200).json("Product added to favorites");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeProductFromFavorites = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    // Find the user by userId
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the product exists in the favorites list
    const productIndex = user.favorites.products.findIndex(
      item => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res
        .status(400)
        .json({ message: "Product not found in favorites" });
    }

    // Remove the product from the favorites list
    user.favorites.products.splice(productIndex, 1);

    // Save the updated user
    await user.save();

    res.status(200).json("Product removed from favorites");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const clearFav = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.favorites.products = [];
    await user.save();

    return res.status(200).json("Favorites cleared");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllFavorites = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by userId and populate the favorite products
    const user = await userModel
      .findById(userId)
      .populate({
        path: "favorites.products.productId",
        select: "name imageUrl category description price",
        populate: { path: "category", select: "name" },
      })
      .exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the favorite products from the user object
    const favoriteProducts = user.favorites.products.map(favorite => {
      const { productId } = favorite;
      const { name, imageUrl, description, price, category } = productId;
      const categoryName = category ? category.name : null;

      return {
        productId: productId._id,
        name,
        imageUrl,
        description,
        price,
        category: categoryName,
      };
    });

    res.status(200).json(favoriteProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserByType = async (req, res) => {
  const { userType } = req.query;
  try {
    const { country } = req.query;
    let user;
    if (country) {
      user = await userModel
        .find({ userType: userType, country: country })
        .select("-password");
    } else {
      user = await userModel.find({ userType: userType }).select("-password");
    }
    // const user = await userModel.find({ userType: userType });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const EditUser = async (req, res) => {
  const { userId } = req.params;
  const {
    username,
    userType,
    email,
    firstMobile,
    secondeMobile,
    thirdMobile,
    subcategory,
    address,
    companyProductsNumber,
    sellType,
    toCountry,
    bio,
    description,
    website,
    slogn,
    link,
    profitRatio,
    city,
    addressDetails,
    contactName,
    floorNum,
    locationType,
  } = req.body;
  console.log(req.body);
  let profileUrlImage;
  let coverUrlImage;
  let frontIdPhotoUrlImage;
  let backIdPhotoUrlImage;
  let tradeLicensePhotoUrlImage;
  let deliveryPermitPhotoUrlImage;

  console.log(req.params);
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if a profile photo is included in the request
    if (req.files && req.files["profilePhoto"]) {
      const profilePhoto = req.files["profilePhoto"][0];
      profileUrlImage =
        "https://back.netzoon.com/" + profilePhoto.path.replace(/\\/g, "/");
    }
    if (req.files && req.files["coverPhoto"]) {
      const coverPhoto = req.files["coverPhoto"][0];
      coverUrlImage =
        "https://back.netzoon.com/" + coverPhoto.path.replace(/\\/g, "/");
    }

    if (req.files && req.files["frontIdPhoto"]) {
      const frontIdPhoto = req.files["frontIdPhoto"][0];
      frontIdPhotoUrlImage =
        "https://back.netzoon.com/" + frontIdPhoto.path.replace(/\\/g, "/");
    }
    if (req.files && req.files["backIdPhoto"]) {
      const backIdPhoto = req.files["backIdPhoto"][0];
      backIdPhotoUrlImage =
        "https://back.netzoon.com/" + backIdPhoto.path.replace(/\\/g, "/");
    }
    if (req.files && req.files["tradeLicensePhoto"]) {
      const tradeLicensePhoto = req.files["tradeLicensePhoto"][0];
      tradeLicensePhotoUrlImage =
        "https://back.netzoon.com/" +
        tradeLicensePhoto.path.replace(/\\/g, "/");
    }
    if (req.files && req.files["deliveryPermitPhoto"]) {
      const deliveryPermitPhoto = req.files["deliveryPermitPhoto"][0];
      deliveryPermitPhotoUrlImage =
        "https://back.netzoon.com/" +
        deliveryPermitPhoto.path.replace(/\\/g, "/");
    }

    user.username = username;
    user.email = email;
    user.firstMobile = firstMobile;
    user.secondeMobile = secondeMobile;
    user.thirdMobile = thirdMobile;
    user.subcategory = subcategory;
    user.address = address;
    user.companyProductsNumber = companyProductsNumber;
    user.sellType = sellType;
    user.toCountry = toCountry;
    user.bio = bio;
    user.description = description;
    user.website = website;
    user.link = link;
    user.slogn = slogn;
    user.profitRatio = profitRatio;
    user.city = city;
    user.addressDetails = addressDetails;
    user.contactName = contactName;
    if (profileUrlImage) {
      user.profilePhoto = profileUrlImage;
    }
    if (coverUrlImage) {
      user.coverPhoto = coverUrlImage;
    }
    if (frontIdPhotoUrlImage) {
      user.frontIdPhoto = frontIdPhotoUrlImage;
    }
    if (backIdPhotoUrlImage) {
      user.backIdPhoto = backIdPhotoUrlImage;
    }
    if (tradeLicensePhotoUrlImage) {
      user.tradeLicensePhoto = tradeLicensePhotoUrlImage;
    }
    if (deliveryPermitPhotoUrlImage) {
      user.deliveryPermitPhoto = deliveryPermitPhotoUrlImage;
    }
    if (userType) {
      user.userType = userType;
    }
    if (floorNum) {
      user.floorNum = floorNum;
    }
    if (locationType) {
      user.locationType = locationType;
    }

    const updatedUser = await user.save();

    res.status(200).json("User Updated Successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSelectedProducts = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel
      .findById(userId)
      .populate("selectedProducts")
      .populate({
        path: "selectedProducts",
        populate: [
          {
            path: "category",
            select: "name",
          },
          {
            path: "owner",
            select: "username userType",
          },
        ],
      });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const selectedProducts = user.selectedProducts;

    res.json(selectedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addProductsToSelectedProducts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productIds } = req.body;

    const user = await userModel.findById(userId);
    console.log(productIds);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const productIdsArray = Array.isArray(productIds)
      ? productIds
      : [productIds];
    console.log("----------------------------------------------------");
    console.log(productIdsArray);
    // let newProductIds;
    // if (productIds.length > 0) {
    //     newProductIds = productIds.filter(productId => !user.selectedProducts.includes(productId));
    // }

    // newProductIds = productIds;
    const newProductIds = productIdsArray.filter(
      productId => !user.selectedProducts.includes(productId)
    );
    user.selectedProducts.push(...newProductIds);
    console.log("--------------------------------");
    console.log(newProductIds);
    await user.save();

    res.json({ message: "Products added to selectedProducts" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProductFromSelectedProducts = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the product ID from the user's selectedProducts
    const index = user.selectedProducts.indexOf(productId);
    if (index !== -1) {
      user.selectedProducts.splice(index, 1);
    }

    // Save the updated user
    await user.save();

    res.json({ message: "Product removed from selectedProducts" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleFollow = async (req, res) => {
  try {
    console.log(req.params);
    console.log(req.body);

    const { currentUserId } = req.body;
    const otherUserId = req.params.otherUserId;
    if (currentUserId === otherUserId) {
      return res.status(500).json({ msg: "You can't follow yourself!!!!!!!!" });
    }
    const currentUser = await userModel.findById(currentUserId);
    const otherUser = await userModel.findById(otherUserId);
    // if we don't follow user, we want to follow him, otherwise we unfollow him
    if (!currentUser.followings.includes(otherUserId)) {
      currentUser.followings.push(otherUserId);
      otherUser.followers.push(currentUserId);
      await currentUser.save();
      await otherUser.save();
      return res.status(200).json("You have successfully followed the user!");
    } else {
      currentUser.followings = currentUser.followings.pull(otherUserId);
      otherUser.followers = otherUser.followers.pull(currentUserId);
      await currentUser.save();
      await otherUser.save();
      return res.status(200).json("You have successfully unfollowed the user!");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

export const getUserFollowings = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userModel.findById(userId).populate("followings");

    // Use a Set to store unique followings
    const uniqueFollowingsSet = new Set();

    // Iterate through the followings and add them to the Set
    user.followings.forEach(following => {
      uniqueFollowingsSet.add(following);
    });

    // Convert the Set back to an array
    const uniqueFollowings = Array.from(uniqueFollowingsSet);

    res.status(200).json(uniqueFollowings);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const getUserFollowers = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userModel.findById(userId).populate("followers");

    // Use a Set to store unique followers
    const uniqueFollowersSet = new Set();

    // Iterate through the followers and add them to the Set
    user.followers.forEach(follower => {
      uniqueFollowersSet.add(follower);
    });
    console.log(uniqueFollowersSet);
    // Convert the Set back to an array
    const uniqueFollowers = Array.from(uniqueFollowersSet);

    res.status(200).json(uniqueFollowers);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const rateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, userId } = req.body;

    const existingUser = await userModel.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyRated = existingUser.ratings.some(rate =>
      rate.user.equals(userId)
    );
    if (alreadyRated) {
      return res.status(400).json("You have already rated this User");
    }

    // Validate the rating value (assumed to be between 1 and 5)
    console.log(rating);
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating value" });
    }

    // Add the new rating to the service
    existingUser.ratings.push({ user: userId, rating });
    existingUser.totalRatings += 1;

    // Calculate the average rating
    const totalRatingSum = existingUser.ratings.reduce(
      (sum, rate) => sum + rate.rating,
      0
    );
    existingUser.averageRating = totalRatingSum / existingUser.totalRatings;

    await existingUser.save();
    res.json("User rated successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getUserTotalRating = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the company service with the given ID exists
    const existingUser = await userModel.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ averageRating: existingUser.averageRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addNumberOfVisitors = async (req, res) => {
  const { viewerUserId } = req.body;
  const profileUserId = req.params.userId;
  try {
    const viewerUser = await userModel.findById(viewerUserId);
    if (!viewerUser) {
      return res.status(404).json({ message: "viewerUser not found" });
    }
    const user = await userModel.findById(profileUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.uniqueProfileVisitors.includes(viewerUserId)) {
      user.uniqueProfileVisitors.push(
        new mongoose.Types.ObjectId(viewerUserId)
      );
      user.profileViews += 1;

      await user.save();
    }

    return res.status(200).json({ message: "Profile viewed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getVisitors = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel
      .findById(id)
      .populate("uniqueProfileVisitors", "username email profilePhoto"); // Add fields you want to populate

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user.uniqueProfileVisitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await userModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json("User deleted successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const deleteAccount = async (req, res) => {
//     const {userId} = req.params;

//     try {

//         const userToDelete = await userModel.findById(userId);

//         if (!userToDelete) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         await userModel.findByIdAndDelete(userId);

//         res.status(200).json('Account deleted successfully');
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Something went wrong' });
//     }
// };

export const deleteAccount = async (req, res) => {
  const { userId } = req.params;

  try {
    const userToDelete = await userModel.findById(userId);

    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProducts = await Product.find({ owner: userId });

    for (const product of userProducts) {
      await DepartmentsCategory.updateOne(
        { _id: product.category },
        { $pull: { products: product._id } }
      );
    }

    await Product.deleteMany({ owner: userId });

    await Advertisement.deleteMany({ owner: userId });

    const userServices = await CompanyServices.find({ owner: userId });

    for (const service of userServices) {
      await serviceCategoryModel.updateOne(
        { services: service._id },
        { $pull: { services: service._id } }
      );
    }

    await CompanyServices.deleteMany({ owner: userId });

    await Vehicle.deleteMany({ creator: userId });

    await RealEstate.deleteMany({ createdBy: userId });

    await News.deleteMany({ creator: userId });

    const userDeals = await DealsItems.find({ owner: userId });

    for (const deal of userDeals) {
      await DealsCategories.updateOne(
        { dealsItems: deal._id },
        { $pull: { dealsItems: deal._id } }
      );
    }

    await DealsItems.deleteMany({ owner: userId });

    // Delete the user
    await userModel.findByIdAndDelete(userId);

    res.status(200).json("Account deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Upload the profile photo and banner photo using multer

// Get the uploaded banner photo filename

// Generate QuickBlox user ID
// let qbUser;
// QB.createSession(async function (error, session) {
//     if (error) {
//         console.log(error);
//         res.status(500).json({ message: error });

//     } else {
//         var params = {
//             login: username,
//             password: password,
//             full_name: username,
//             email: email,
//         };
//         await QB.users.create(params, function (error, user) {
//             if (error) {
//                 console.log(error);
//                 console.log('11111111111111');
//                 res.status(500).json({ message: error });
//             } else {
//                 // Log in the user
//                 QB.login(params, async function (error, result) {
//                     if (error) {
//                         // Handle error
//                         console.log('11111111111111');
//                         console.log(error);
//                         res.status(500).json({ message: error });
//                     } else {
//                         console.log(result);
//                         qbUser = result
//                         // User is logged in

//                         const newUser = await userModel.create({
//                             quickbloxId: result.id,
//                             username,
//                             email,
//                             password: hashedPassword,
//                             userType,
//                             firstMobile,
//                             secondeMobile,
//                             thirdMobile,
//                             isFreeZoon: isFreeZoon,
//                             deliverable: deliverable,
//                             subcategory,
//                             address,
//                             businessLicense,
//                             companyProductsNumber,
//                             sellType,
//                             toCountry,
//                             profilePhoto: profileUrlImage,
//                             coverPhoto: coverUrlImage,
//                             banerPhoto: banerUrlImage,
//                             frontIdPhoto: frontIdPhotoUrlImage,
//                             backIdPhoto: backIdPhotoUrlImage,
//                             tradeLicensePhoto: tradeLicensePhotoUrl,
//                             deliveryPermitPhoto: deliveryPermitPhotoUrl,
//                             country: country,
//                             isThereWarehouse: isThereWarehouse,
//                             isThereFoodsDelivery: isThereFoodsDelivery,
//                             deliveryType: deliveryType,
//                             deliveryCarsNum: deliveryCarsNum,
//                             deliveryMotorsNum: deliveryMotorsNum
//                         });

//                         // const account = await Account.create({ user: newUser._id });
//                         // newUser.accounts.push(account._id);
//                         // await newUser.save();

//                         const token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
//                         if (userType === 'factory') {
//                             const factoryCategory = await FactoryCategories.findOneAndUpdate(
//                                 { title: title }, // Update this condition based on your requirements
//                                 { $push: { factory: newUser._id } },
//                                 { new: true }
//                             );

//                             // Handle case when FactoryCategories document doesn't exist
//                             if (!factoryCategory) {
//                                 // Create a new FactoryCategories document
//                                 await FactoryCategories.create({
//                                     title: title,
//                                     factory: [newUser._id],
//                                 });
//                             }
//                         }
//                         res.status(201).json({
//                             result: newUser,
//                             message: "User created",
//                             token: token,
//                         });
//                     }
//                 });
//             }
//         });

//     }
// },
// );
