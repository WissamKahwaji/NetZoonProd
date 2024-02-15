import mongoose from "mongoose";
import { Advertisement } from "../models/advertisements/advertisementsModel.js";
import userModel from "../models/userModel.js";
import { PurchAds } from "../models/advertisements/purch_ads_model.js";

export const getAdvertisements = async (req, res) => {
  try {
    const {
      priceMin,
      priceMax,
      owner,
      purchasable,
      startDate,
      endDate,
      year,
      type,
    } = req.query;

    const currentDate = new Date();

    const query = {
      advertisingEndDate: { $gt: currentDate.toISOString() },
    };

    if (priceMin !== undefined && priceMax !== undefined) {
      query.advertisingPrice = {
        $gte: parseFloat(priceMin),
        $lte: parseFloat(priceMax),
      };
    } else if (priceMin !== undefined) {
      query.advertisingPrice = {
        $gte: parseFloat(priceMin),
      };
    } else if (priceMax !== undefined) {
      query.advertisingPrice = {
        $lte: parseFloat(priceMax),
      };
    }

    if (owner) {
      const ownerId = await userModel.findOne({ username: owner });

      if (ownerId) {
        query.owner = new mongoose.Types.ObjectId(ownerId._id);
      }
    }

    if (purchasable !== undefined) {
      query.purchasable = purchasable === "true";
    }

    if (startDate && endDate) {
      query.advertisingStartDate = { $lt: endDate };
      query.advertisingEndDate = { $gt: startDate };
    } else if (startDate) {
      query.advertisingStartDate = startDate;
    } else if (endDate) {
      query.advertisingEndDate = endDate;
    }

    if (year) {
      query.advertisingYear = year;
    }

    if (type) {
      query.advertisingType = type;
    }

    const data = await Advertisement.find(query).populate(
      "owner",
      "username userType"
    );

    return res.json({
      message: "success",
      results: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserAds = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await Advertisement.find({ owner: userId }).populate(
      "owner",
      "username userType"
    );
    return res.json({
      message: "success",
      results: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getAdvertisementById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Advertisement.findById(id).populate(
      "owner",
      "username userType profilePhoto firstMobile"
    );
    if (!data) {
      return res.status(404).json({ message: "no Data Found" });
    }
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAdvertisementByType = async (req, res) => {
  const userAdvertisingType = req.params.userAdvertisingType;

  const currentDate = new Date();

  try {
    const data = await Advertisement.find({
      advertisingType: userAdvertisingType,
      advertisingEndDate: { $gt: currentDate.toISOString() },
    }).populate("owner", "username userType");
    if (!data) {
      return res.status(404).json({ message: "no Data Found" });
    }

    return res.json({
      message: "success",
      results: data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createAds = async (req, res) => {
  const {
    owner,
    advertisingTitle,
    advertisingStartDate,
    advertisingEndDate,
    advertisingDescription,
    advertisingViews,
    advertisingYear,
    advertisingLocation,
    advertisingPrice,
    advertisingType,
    purchasable,
    type,
    category,
    color,
    guarantee,
    contactNumber,
    imagePath,
    itemId,
    forPurchase,
  } = req.body;

  try {
    let urlImage;
    if (imagePath) {
      urlImage = imagePath;
    } else {
      const image = req.files["image"][0];
      if (!image) {
        return res
          .status(404)
          .json({ message: "Attached file is not an image." });
      }
      urlImage =
        "https://www.netzoonback.siidevelopment.com/" +
        image.path.replace(/\\/g, "/");
    }

    const ownerId = new mongoose.Types.ObjectId(owner);

    const newAds = new Advertisement({
      owner: ownerId,
      advertisingTitle,
      advertisingStartDate,
      advertisingEndDate,
      advertisingDescription,
      advertisingImage: urlImage,
      advertisingViews,
      advertisingYear,
      advertisingLocation,
      advertisingPrice,
      advertisingType,
      purchasable: purchasable,
      type,
      category,
      color,
      guarantee,
      contactNumber,
      forPurchase,
    });
    if (req.files["advertisingImageList"]) {
      const adsImages = req.files["advertisingImageList"];
      const imageUrls = [];
      if (!adsImages || !Array.isArray(adsImages)) {
        return res
          .status(404)
          .json({ message: "Attached files are missing or invalid." });
      }

      for (const image of adsImages) {
        if (!image) {
          return res
            .status(404)
            .json({ message: "Attached file is not an image." });
        }

        const imageUrl =
          "https://www.netzoonback.siidevelopment.com/" +
          image.path.replace(/\\/g, "/");
        imageUrls.push(imageUrl);
        newAds.advertisingImageList = imageUrls;
      }
    }
    if (req.files["video"]) {
      const video = req.files["video"][0];
      const urlVideo =
        "https://www.netzoonback.siidevelopment.com/" +
        video.path.replace(/\\/g, "/");
      newAds.advertisingVedio = urlVideo;
    }
    if (itemId) newAds.itemId = itemId;
    if (forPurchase) newAds.forPurchase = forPurchase;
    const savedAds = await newAds.save();
    res.status(201).json(savedAds._id);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const editAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      advertisingTitle,
      advertisingStartDate,
      advertisingEndDate,
      advertisingDescription,
      advertisingYear,
      advertisingLocation,
      advertisingPrice,
      advertisingType,
      purchasable,
      type,
      category,
      color,
      guarantee,
      contactNumber,
    } = req.body;

    // Check if advertisement with the given ID exists
    const existingAd = await Advertisement.findById(id);
    if (!existingAd) {
      return res.status(404).json({ message: "Advertisement not found" });
    }
    if (req.userId != existingAd.owner) {
      return res.status(403).json("Error in Authurization");
    }

    existingAd.advertisingTitle = advertisingTitle;
    existingAd.advertisingStartDate = advertisingStartDate;
    existingAd.advertisingEndDate = advertisingEndDate;
    existingAd.advertisingDescription = advertisingDescription;
    existingAd.advertisingYear = advertisingYear;
    existingAd.advertisingLocation = advertisingLocation;
    existingAd.advertisingPrice = advertisingPrice;
    existingAd.advertisingType = advertisingType;
    existingAd.purchasable = purchasable;
    existingAd.type = type;
    existingAd.category = category;
    existingAd.color = color;
    existingAd.guarantee = guarantee;
    existingAd.contactNumber = contactNumber;

    if (req.files["image"]) {
      const image = req.files["image"][0];
      const urlImage =
        "https://www.netzoonback.siidevelopment.com/" +
        image.path.replace(/\\/g, "/");
      existingAd.advertisingImage = urlImage;
    }

    if (req.files["advertisingImageList"]) {
      const adsImages = req.files["advertisingImageList"];
      const imageUrls = [];
      if (!adsImages || !Array.isArray(adsImages)) {
        return res
          .status(404)
          .json({ message: "Attached files are missing or invalid." });
      }

      for (const image of adsImages) {
        if (!image) {
          return res
            .status(404)
            .json({ message: "Attached file is not an image." });
        }

        const imageUrl =
          "https://www.netzoonback.siidevelopment.com/" +
          image.path.replace(/\\/g, "/");
        imageUrls.push(imageUrl);
      }
      existingAd.advertisingImageList = imageUrls;
    }

    if (req.files["video"]) {
      const video = req.files["video"][0];
      const urlVideo =
        "https://www.netzoonback.siidevelopment.com/" +
        video.path.replace(/\\/g, "/");
      existingAd.advertisingVedio = urlVideo;
    }

    const updatedAd = await existingAd.save();
    res.json("Advertisement updated successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;

    const existingAd = await Advertisement.findById(id);
    if (!existingAd) {
      return res.status(404).json("Advertisement not found");
    }

    if (req.userId != existingAd.owner) {
      return res.status(403).json("Error in Authurization");
    }
    // Delete the advertisement
    await Advertisement.findByIdAndRemove(id);

    res.json("Advertisement deleted successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addNumberOfVisitors = async (req, res) => {
  try {
    const { viewerUserId } = req.body;
    const adsId = req.params.adsId;
    const viewerUser = await userModel.findById(
      new mongoose.Types.ObjectId(viewerUserId)
    );
    if (!viewerUser) {
      return res.status(404).json({ message: "viewerUser not found" });
    }
    const ads = await Advertisement.findById(adsId);
    if (!ads) {
      return res.status(404).json({ message: "ads not found" });
    }
    if (!ads.adsVisitors.includes(viewerUserId)) {
      ads.adsVisitors.push(new mongoose.Types.ObjectId(viewerUserId));
      ads.adsViews += 1;

      await ads.save();
    }

    return res.status(200).json({ message: "ads viewed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const savePurchAds = async (req, res) => {
  try {
    const { userId } = req.params;
    const { ads, grandTotal, shippingAddress, mobile } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const purchAdsModel = new PurchAds({
      userId: userId,
      ads,
      grandTotal,
      shippingAddress,
      mobile,
    });
    const response = await purchAdsModel.save();
    console.log(response);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserPurchAds = async (req, res) => {
  try {
    const { userId } = req.params;
    const ads = await PurchAds.find({ userId }).populate({
      path: "ads.ads",
      populate: [{ path: "owner", select: "username userType" }],
    });
    res.status(200).json(ads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
