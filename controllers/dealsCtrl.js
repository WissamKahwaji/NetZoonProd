import mongoose from "mongoose";
import { DealsCategories } from "../models/deals/dealsCategoriesModel.js";
import { DealsItems } from "../models/deals/dealsItemsModel.js";
import { PurchDeals } from "../models/deals/purch_deal_model.js";
import userModel from "../models/userModel.js";

export const getAllDealsCategories = async (req, res) => {
  try {
    const dealsCat = await DealsCategories.find({});
    if (!dealsCat) {
      return res.status(404).json({ message: "no Data Found" });
    }
    return res.json({
      message: "success",
      results: dealsCat,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllDeals = async (req, res) => {
  try {
    const { country } = req.query;

    let dealsItems;
    if (country) {
      dealsItems = await DealsItems.find({ country: country }).populate(
        "owner",
        "username userType"
      );
    } else {
      dealsItems = await DealsItems.find();
    }

    // const dealsItems = await DealsItems.find({ country: country });
    if (!dealsItems) {
      return res.status(404).json({ message: "no Data Found" });
    }
    return res.json({
      message: "success",
      results: dealsItems,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllDealsByCat = async (req, res) => {
  try {
    const { country, category, companyName, minPrice, maxPrice } = req.query;

    const filterCriteria = {
      category: category,
      country: country,
    };

    if (companyName) {
      filterCriteria.companyName = companyName;
    }

    if (minPrice && maxPrice) {
      filterCriteria.currentPrice = {
        $gte: parseFloat(minPrice),
        $lte: parseFloat(maxPrice),
      };
    } else if (minPrice) {
      filterCriteria.currentPrice = { $gte: parseFloat(minPrice) };
    } else if (maxPrice) {
      filterCriteria.currentPrice = { $lte: parseFloat(maxPrice) };
    }

    const dealsItems = await DealsItems.find(filterCriteria).populate(
      "owner",
      "username userType"
    );

    if (!dealsItems || dealsItems.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    return res.json({
      message: "Success",
      results: dealsItems,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getDealById = async (req, res) => {
  const { id } = req.params;
  try {
    const deal = await DealsItems.findById(id).populate(
      "owner",
      "username userType"
    );
    if (!deal) {
      return res.status(404).json({ message: "no Data Found" });
    }
    return res.json(deal);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const AddDeal = async (req, res) => {
  const {
    owner,
    name,
    companyName,
    prevPrice,
    currentPrice,
    startDate,
    endDate,
    location,
    category,
    country,
    description,
  } = req.body;
  try {
    const ownerId = new mongoose.Types.ObjectId(owner);
    const image = req.files["dealImage"][0];

    if (!image) {
      return res
        .status(404)
        .json({ message: "Attached file is not an image." });
    }

    const imgUrl = "https://back.netzoon.com/" + image.path.replace(/\\/g, "/");
    const foundCategory = await DealsCategories.findOne({ name: category });

    console.log(foundCategory);

    if (!foundCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Create a new deal item using the deal data
    const dealData = {
      owner: ownerId,
      name,
      imgUrl,
      companyName,
      prevPrice,
      currentPrice,
      startDate,
      endDate,
      location,
      category,
      country,
      description,
    };

    const deal = new DealsItems(dealData);

    // Save the new deal item
    await deal.save();

    // Add the new deal item to the category's dealsItems array
    foundCategory.dealsItems.push(deal._id);

    // Save the updated category
    await foundCategory.save();

    return res.json(deal._id);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const editDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      companyName,
      prevPrice,
      currentPrice,
      startDate,
      endDate,
      location,
      category,
      country,
      description,
    } = req.body;

    // Check if deals item with the given ID exists
    const existingDeal = await DealsItems.findById(id);
    if (!existingDeal) {
      return res.status(404).json({ message: "Deals item not found" });
    }

    existingDeal.name = name;
    existingDeal.companyName = companyName;
    existingDeal.prevPrice = prevPrice;
    existingDeal.currentPrice = currentPrice;
    existingDeal.startDate = startDate;
    existingDeal.endDate = endDate;
    existingDeal.location = location;
    existingDeal.category = category;
    existingDeal.country = country;
    existingDeal.description = description;

    if (req.files["dealImage"]) {
      const image = req.files["dealImage"][0];
      const imgUrl =
        "https://back.netzoon.com/" + image.path.replace(/\\/g, "/");
      existingDeal.imgUrl = imgUrl;
    }

    const updatedDeal = await existingDeal.save();
    res.json("Deals item updated successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDeal = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if deals item with the given ID exists
    const existingDeal = await DealsItems.findById(id);
    if (!existingDeal) {
      return res.status(404).json("Deals item not found");
    }

    // Delete the deals item
    await DealsItems.findByIdAndRemove(id);

    res.json("Deals item deleted successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserDeals = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await DealsItems.find({ owner: userId }).populate(
      "owner",
      "username userType"
    );
    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const savePurchDeal = async (req, res) => {
  try {
    const { userId } = req.params;
    const { deals, grandTotal, shippingAddress, mobile } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const purchDealsModel = new PurchDeals({
      userId: userId,
      deals,
      grandTotal,
      shippingAddress,
      mobile,
    });
    const response = await purchDealsModel.save();
    console.log(response);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserPurchDeal = async (req, res) => {
  try {
    const { userId } = req.params;
    const deals = await PurchDeals.find({ userId }).populate({
      path: "deals.deals",
      populate: [{ path: "owner", select: "username userType" }],
    });
    res.status(200).json(deals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
