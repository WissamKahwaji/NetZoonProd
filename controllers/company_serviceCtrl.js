import { CompanyServices } from "../models/company_services/company_service_model.js";
import { serviceCategoryModel } from "../models/company_services/service_category_model.js";

export const getCompanyServices = async (req, res) => {
  try {
    const { id } = req.params;
    const services = await CompanyServices.find({ owner: id }).populate(
      "owner",
      "username"
    );
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getServicesCategories = async (req, res) => {
  try {
    const categories = await serviceCategoryModel.find().select("title");
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getServicesByCategories = async (req, res) => {
  try {
    const { category, country } = req.query;
    const services = await serviceCategoryModel.findById(category).populate({
      path: "services",
      match: { country: country },
      populate: [
        {
          path: "owner",
          select: "username country",
        },
      ],
    });
    return res.status(200).json(services);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await CompanyServices.findById(id).populate(
      "owner",
      "username"
    );
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addCompanyService = async (req, res) => {
  try {
    console.log(req.query);
    const { category, country } = req.query;
    const { title, description, price, owner, whatsAppNumber, bio } = req.body;
    const image = req.files["image"] ? req.files["image"][0] : null;

    const imageUrl = image
      ? "https://back.netzoon.com/" + image.path.replace(/\\/g, "/")
      : null;

    const serviceCategory = await serviceCategoryModel.findById(category);
    if (!serviceCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const newService = new CompanyServices({
      title,
      description,
      price,
      owner,
      imageUrl: imageUrl,
      whatsAppNumber: whatsAppNumber,
      bio: bio,
      country: country,
    });

    if (req.files["serviceImageList"]) {
      const serviceImages = req.files["serviceImageList"];
      const imageUrls = [];
      if (!serviceImages || !Array.isArray(serviceImages)) {
        return res
          .status(404)
          .json({ message: "Attached files are missing or invalid." });
      }

      for (const image of serviceImages) {
        if (!image) {
          return res
            .status(404)
            .json({ message: "Attached file is not an image." });
        }

        const imageUrl =
          "https://back.netzoon.com/" + image.path.replace(/\\/g, "/");
        imageUrls.push(imageUrl);
        newService.serviceImageList = imageUrls;
      }
    }
    if (req.files["video"]) {
      const video = req.files["video"][0];
      const urlVideo =
        "https://back.netzoon.com/" + video.path.replace(/\\/g, "/");
      newService.vedioUrl = urlVideo;
    }

    await newService.save();

    serviceCategory.services.push(newService._id);
    await serviceCategory.save();

    res.status(201).json("The service has been added successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editCompanyService = async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    const { title, description, price, whatsAppNumber, bio } = req.body;
    console.log(req.body);

    // Check if the company service with the given ID exists
    const existingService = await CompanyServices.findById(id);
    if (!existingService) {
      return res.status(404).json({ message: "Company service not found" });
    }

    // Update company service fields
    existingService.title = title;
    existingService.description = description;
    if (price) {
      existingService.price = price;
    }
    if (whatsAppNumber) {
      existingService.whatsAppNumber = whatsAppNumber;
    }
    if (bio) {
      existingService.bio = bio;
    }

    if (req.files["image"]) {
      const image = req.files["image"][0];
      const urlImage =
        "https://back.netzoon.com/" + image.path.replace(/\\/g, "/");
      existingService.imageUrl = urlImage;
    }

    if (req.files["serviceImageList"]) {
      const serviceImages = req.files["serviceImageList"];
      const imageUrls = [];
      if (!serviceImages || !Array.isArray(serviceImages)) {
        return res
          .status(404)
          .json({ message: "Attached files are missing or invalid." });
      }

      for (const image of serviceImages) {
        if (!image) {
          return res.status(404).json("Attached file is not an image.");
        }

        const imageUrl =
          "https://back.netzoon.com/" + image.path.replace(/\\/g, "/");
        imageUrls.push(imageUrl);
        existingService.serviceImageList = imageUrls;
      }
    }
    if (req.files["video"]) {
      const video = req.files["video"][0];
      const urlVideo =
        "https://back.netzoon.com/" + video.path.replace(/\\/g, "/");
      existingService.vedioUrl = urlVideo;
    }

    await existingService.save();
    res.json("Company service updated successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteCompanyService = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the company service with the given ID exists
    const existingService = await CompanyServices.findById(id);
    if (!existingService) {
      return res.status(404).json("Company service not found");
    }

    // Delete the company service
    await CompanyServices.findByIdAndRemove(id);

    res.json("Company service deleted successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rateCompanyService = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, userId } = req.body;

    const existingService = await CompanyServices.findById(id);
    if (!existingService) {
      return res.status(404).json({ message: "Company service not found" });
    }

    const alreadyRated = existingService.ratings.some(rate =>
      rate.user.equals(userId)
    );
    if (alreadyRated) {
      return res.status(400).json("You have already rated this service");
    }

    // Validate the rating value (assumed to be between 1 and 5)
    console.log(rating);
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating value" });
    }

    // Add the new rating to the service
    existingService.ratings.push({ user: userId, rating });
    existingService.totalRatings += 1;

    // Calculate the average rating
    const totalRatingSum = existingService.ratings.reduce(
      (sum, rate) => sum + rate.rating,
      0
    );
    existingService.averageRating =
      totalRatingSum / existingService.totalRatings;

    await existingService.save();
    res.json({
      message: "Service rated successfully",
      updatedService: existingService,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getTotalRating = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the company service with the given ID exists
    const existingService = await CompanyServices.findById(id);
    if (!existingService) {
      return res.status(404).json({ message: "Company service not found" });
    }

    res.json({ averageRating: existingService.averageRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
