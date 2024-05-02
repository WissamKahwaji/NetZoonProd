import { Departments } from "../../models/product/departmenst/departmenst_model.js";
import { DepartmentsCategory } from "../../models/product/departmenst/categories/departments_categories_model.js";
import { Product } from "../../models/product/product.js";
import { deleteFile } from "../../utils/file.js";
import mongoose from "mongoose";
import userModel from "../../models/userModel.js";
import { Order } from "../../models/order/order_model.js";
// import upload from "../../middlewares/upload.js";
// import multer from "multer";

const PAGINATION_LIMIT = 10;

export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Departments.find().select("-departmentsCategory");
    return res.status(200).json(departments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllDepartmentsCategories = async (req, res) => {
  try {
    const categories = await DepartmentsCategory.find();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { country, page } = req.query;
    const pageNumber = parseInt(page, 10) || 1;
    let products;

    if (country) {
      products = await Product.find({ country })
        .skip((pageNumber - 1) * PAGINATION_LIMIT)
        .limit(PAGINATION_LIMIT)
        .populate("category", "name")
        .populate("owner");
    } else {
      products = await Product.find()
        .skip((page - 1) * PAGINATION_LIMIT)
        .limit(PAGINATION_LIMIT)
        .populate("category", "name")
        .populate("owner");
    }

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getBestDealsProducts = async (req, res) => {
  try {
    const { country, page } = req.query;

    const pageNumber = parseInt(page, 10) || 1;

    let query = { discountPercentage: { $gt: 0 } };

    if (country) {
      query.country = country;
    }

    const totalCount = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort({ discountPercentage: -1 })
      .skip((pageNumber - 1) * PAGINATION_LIMIT)
      .limit(PAGINATION_LIMIT)
      .populate("category", "name")
      .populate("owner")
      .populate({
        path: "ratings",
        populate: {
          path: "user",
          select: ["username", "userType"],
        },
      });
    const totalPages = Math.ceil(totalCount / PAGINATION_LIMIT);

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCategoriesWithOffers = async (req, res) => {
  try {
    const allCategories = await DepartmentsCategory.find()
      .populate("products")
      .populate("department", "-departmentsCategory");
    const categoriesWithMaxDiscount = allCategories
      .filter(category => {
        if (!category.products || category.products.length === 0) {
          return false; // Skip categories with no products
        }
        const maxDiscountProduct = category.products.reduce(
          (maxProduct, currentProduct) => {
            return currentProduct.discountPercentage >
              maxProduct.discountPercentage
              ? currentProduct
              : maxProduct;
          },
          category.products[0]
        );
        return maxDiscountProduct.discountPercentage > 0; // Filter categories with max discount product
      })
      .map(category => ({
        _id: category._id,
        name: category.name,
        imageUrl: category.imageUrl,
        department: category.department,
        maxDiscount: Math.max(
          ...category.products.map(product => product.discountPercentage)
        ),
      }));

    return res.json(categoriesWithMaxDiscount);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOfferedProductsInCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { page } = req.query;

    const pageNumber = parseInt(page, 10) || 1;

    const category = await DepartmentsCategory.findById(categoryId).populate(
      "products"
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const offeredProducts = category.products.filter(
      product => product.discountPercentage > 0
    );

    const totalCount = offeredProducts.length;
    const totalPages = Math.ceil(totalCount / PAGINATION_LIMIT);

    const paginatedProducts = offeredProducts.slice(
      (pageNumber - 1) * PAGINATION_LIMIT,
      pageNumber * PAGINATION_LIMIT
    );

    return res.json(paginatedProducts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getBestSellingProducts = async (req, res) => {
  try {
    const { page } = req.query;

    const pageNumber = parseInt(page, 10) || 1;

    const bestSellingProducts = await Order.aggregate([
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: "$products.product", // Group by product
          totalQuantitySold: { $sum: "$products.qty" }, // Calculate total quantity sold
        },
      },
      {
        $sort: { totalQuantitySold: -1 }, // Sort by total quantity sold in descending order
      },
      {
        $skip: (pageNumber - 1) * PAGINATION_LIMIT, // Skip documents based on pagination
      },
      {
        $limit: PAGINATION_LIMIT, // Limit to the specified number of products per page
      },
    ]);

    // Populate product details for best selling products
    const populatedBestSellingProducts = await Product.populate(
      bestSellingProducts,
      {
        path: "_id",
        populate: [
          "owner",
          {
            path: "category",
            populate: [
              {
                path: "department",
                select: "-departmentsCategory",
              },
            ],
          },
          {
            path: "ratings",
            populate: {
              path: "user",
              select: ["username", "userType"],
            },
          },
        ],
      }
    );
    const totalCount = populatedBestSellingProducts.length;
    const totalPages = Math.ceil(totalCount / PAGINATION_LIMIT);
    return res.json(populatedBestSellingProducts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getBestDealsProductsRandomly = async (req, res) => {
  try {
    const { country } = req.query;
    const { page } = req.query;

    const pageNumber = parseInt(page, 10) || 1;
    let products;

    if (country) {
      products = await Product.find({ country, discountPercentage: { $gt: 0 } })
        .skip((pageNumber - 1) * PAGINATION_LIMIT)
        .limit(PAGINATION_LIMIT)
        .populate("category", "name")
        .populate("owner")
        .populate({
          path: "ratings",
          populate: {
            path: "user",
            select: ["username", "userType"],
          },
        });
    } else {
      products = await Product.find({ discountPercentage: { $gt: 0 } })
        .skip((pageNumber - 1) * PAGINATION_LIMIT)
        .limit(PAGINATION_LIMIT)
        .populate("category", "name")
        .populate("owner")
        .populate({
          path: "ratings",
          populate: {
            path: "user",
            select: ["username", "userType"],
          },
        });
    }

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getBestOffersInDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { country } = req.query;
    const { page } = req.query;

    const pageNumber = parseInt(page, 10) || 1;
    // Find department category IDs
    const departmentCategories = await DepartmentsCategory.find({
      department: departmentId,
    }).select("_id");

    // Construct query to find products with offers in the specified department
    const query = {
      category: { $in: departmentCategories },
      discountPercentage: { $gt: 0 },
    };

    if (country) {
      query.country = country;
    }

    // Find products matching the query and populate category and department details
    const products = await Product.find(query)
      .sort({ discountPercentage: -1 })
      .skip((pageNumber - 1) * PAGINATION_LIMIT)
      .limit(PAGINATION_LIMIT)
      .populate({
        path: "category",
        populate: [
          {
            path: "department",
            select: "-departmentsCategory",
          },
        ],
      })
      .populate("owner");

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getSelectedProductsInDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { page } = req.query;

    const pageNumber = parseInt(page, 10) || 1;
    const departmentCategories = await DepartmentsCategory.find({
      department: departmentId,
    }).select("_id");

    const products = await Product.find({
      category: { $in: departmentCategories },
      UsersSelected: { $exists: true, $not: { $size: 0 } },
    })
      .skip((pageNumber - 1) * PAGINATION_LIMIT)
      .limit(PAGINATION_LIMIT)
      .populate("owner")

      .populate("category");

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getSelectableProducts = async (req, res) => {
  try {
    const { country } = req.query;
    const { page } = req.query;

    const pageNumber = parseInt(page, 10) || 1;
    let selectableProducts;

    if (country) {
      selectableProducts = await Product.find({ country })
        .skip((pageNumber - 1) * PAGINATION_LIMIT)
        .limit(PAGINATION_LIMIT)
        .populate({
          path: "owner",
          select: "username userType isSelectable",
          match: { isSelectable: true },
        })
        .populate("category", "name")
        .exec();
    } else {
      selectableProducts = await Product.find()
        .skip((pageNumber - 1) * PAGINATION_LIMIT)
        .limit(PAGINATION_LIMIT)
        .populate({
          path: "owner",
          select: "username userType isSelectable",
          match: { isSelectable: true },
        })
        .populate("category", "name")
        .exec();
    }

    const filteredProducts = selectableProducts.filter(
      product => product.owner !== null
    );

    return res.json(filteredProducts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getLatestProducts = async (req, res) => {
  try {
    const { country, page } = req.query;
    let queryParams = {};
    const pageNumber = parseInt(page, 10) || 1;

    if (country) {
      queryParams.country = country;
    }

    const totalCount = await Product.countDocuments(queryParams);

    const products = await Product.find(queryParams)
      .sort({ _id: -1 })
      .skip((pageNumber - 1) * PAGINATION_LIMIT)
      .limit(PAGINATION_LIMIT)
      .populate("category", "name")
      .populate("owner")
      .populate({
        path: "ratings",
        populate: {
          path: "user",
          select: ["username", "userType"],
        },
      });

    const totalPages = Math.ceil(totalCount / PAGINATION_LIMIT);

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getSimilarProducts = async (req, res) => {
  try {
    const { country, page } = req.query;
    const { categoriesList } = req.body;
    let queryParams = {};
    const pageNumber = parseInt(page, 10) || 1;

    if (country) {
      queryParams.country = country;
    }
    if (categoriesList && categoriesList.length > 0) {
      queryParams.category = { $in: categoriesList };
    }

    const totalCount = await Product.countDocuments(queryParams);

    const products = await Product.find(queryParams)
      .skip((pageNumber - 1) * PAGINATION_LIMIT)
      .limit(PAGINATION_LIMIT)
      .populate("category", "name")
      .populate("owner");

    const totalPages = Math.ceil(totalCount / PAGINATION_LIMIT);

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId)
      .populate("category", "name")
      .populate("owner", "-password")
      .populate({
        path: "ratings",
        populate: {
          path: "user",
        },
      });
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const filterOnProducts = async (req, res) => {
  try {
    const { country, priceMin, priceMax, owner, condition } = req.query;
    const { page } = req.query;

    const pageNumber = parseInt(page, 10) || 1;
    let query = {};
    if (country) {
      query.country = country;
    }

    if (priceMin && !isNaN(priceMin)) {
      query.price = { $gte: parseFloat(priceMin) };
    }

    if (priceMax && !isNaN(priceMax)) {
      if (query.price) {
        query.price.$lte = parseFloat(priceMax);
      } else {
        query.price = { $lte: parseFloat(priceMax) };
      }
    }

    if (owner) {
      // Find the owner by name and retrieve its ObjectId
      const foundOwner = await userModel.findOne({ username: owner });
      if (foundOwner) {
        query.owner = foundOwner._id; // Use the ObjectId in the query
      } else {
        // Handle the case where the owner name is not found
        return res.status(404).json({ message: "Owner not found" });
      }
    }

    if (condition) {
      query.condition = condition;
    }
    let products = await Product.find(query)
      .skip((pageNumber - 1) * PAGINATION_LIMIT)
      .limit(PAGINATION_LIMIT)
      .populate("category", "name")
      .populate("owner", "-password");
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCategoriesByDepartment = async (req, res) => {
  try {
    const { department } = req.query;
    const departmentres = await Departments.findOne({
      name: department,
    }).populate({
      path: "departmentsCategory",
      populate: [
        {
          path: "department",
          select: "-departmentsCategory",
        },
      ],
    });
    if (!departmentres) {
      return res.status(404).json({ message: "no Data Found" });
    }
    const categories = await departmentres.departmentsCategory;
    if (categories) {
      return res.json({
        message: "success",
        results: categories,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// export const getProductsByCategory = async (req, res) => {
//     try {
//         const { country } = req.query;

//         const { department, category } = req.body;

//         await Product.find();

//         const departments = await Departments.findOne({ name: department });
//         if (!departments) {
//             return res.status(404).json({ message: `Department ${department} not found` });
//         }
//         console.log(departments._id);
//         // const categories = await DepartmentsCategory.findOne({ name: category, department: departments._id }).populate('products').populate({
//         //     path: 'products',
//         //     populate: {
//         //         path: 'category',
//         //         select: 'name',
//         //     },
//         // });
//         const categories = await DepartmentsCategory.findOne({ name: category, department: departments._id })
//             .populate({
//                 path: 'products',
//                 populate: [
//                     {
//                         path: 'category',
//                         select: 'name',
//                     },
//                     {
//                         path: 'owner',
//                         select: 'username',
//                     },
//                 ],
//             });
//         console.log(categories);
//         if (!categories) {
//             return res.status(404).json({ message: `Category ${category} not found in department ${department}` });
//         }
//         categories.products.category = category;
//         const products = await categories.products.filter(product => product.country === country);

//         if (products) {
//             return res.json({
//                 message: "success",
//                 department,
//                 category,
//                 results: products,
//             });
//         } else {
//             res.status(404).send(`Category ${category} not found in department ${department}`);

//         }
//     } catch (error) {
//         return res.status(500).json({ message: error.message });

//     }
// };

export const getProductsByCategory = async (req, res) => {
  try {
    const { country, priceMin, priceMax, owner, condition, page } = req.query;
    const { department, category } = req.query;

    // Parse the page number
    const pageNumber = parseInt(page, 10) || 1;

    // Find the department by name
    const departments = await Departments.findOne({ name: department });
    if (!departments) {
      return res
        .status(404)
        .json({ message: `Department ${department} not found` });
    }

    // Find the category by name and department
    const categories = await DepartmentsCategory.findOne({
      name: category,
      department: departments._id,
    }).populate({
      path: "products",
      populate: [
        { path: "category", select: "name" },
        { path: "owner", select: "-password" },
      ],
    });

    if (!categories) {
      return res.status(404).json({
        message: `Category ${category} not found in department ${department}`,
      });
    }

    // Apply the filters based on the provided query parameters
    let filteredProducts = categories.products.filter(product => {
      // Filter by country
      if (country && product.country !== country) {
        return false;
      }

      // Filter by priceMin
      if (priceMin && parseFloat(product.price) < parseFloat(priceMin)) {
        return false;
      }

      // Filter by priceMax
      if (priceMax && parseFloat(product.price) > parseFloat(priceMax)) {
        return false;
      }

      // Filter by owner
      if (owner && product.owner.username !== owner) {
        return false;
      }

      // Filter by condition
      if (condition && product.condition !== condition) {
        return false;
      }

      return true;
    });

    // Paginate the filtered products
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / PAGINATION_LIMIT);
    const paginatedProducts = filteredProducts.slice(
      (pageNumber - 1) * PAGINATION_LIMIT,
      pageNumber * PAGINATION_LIMIT
    );

    if (paginatedProducts.length === 0) {
      return res
        .status(404)
        .json("No products found with the provided filters");
    }

    return res.json({
      message: "success",
      department,
      category,
      totalProducts,
      totalPages,
      currentPage: pageNumber,
      results: paginatedProducts,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { departmentName, categoryName } = req.body;
    const {
      owner,
      name,
      condition,
      description,
      price,
      quantity,
      weight,
      guarantee,
      address,
      madeIn,
      year,
      discountPercentage,
      country,
      color,
    } = req.body;
    const image = req.files["image"][0];

    const ownerId = new mongoose.Types.ObjectId(owner);
    // const existingUser = await userModel.findOne({ _id: ownerId });
    // if (!existingUser) {
    //     return res.status(500).json({ message: "User don't exists" });
    // }

    if (!image) {
      return res
        .status(404)
        .json({ message: "Attached file is not an image." });
    }

    const urlImage =
      "https://www.netzoonback.siidevelopment.com/" +
      image.path.replace(/\\/g, "/");

    // Find department by name
    const department = await Departments.findOne({ name: departmentName });
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Find category by name and department
    const category = await DepartmentsCategory.findOne({
      name: categoryName,
      department: department._id,
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    let discountedPrice = price;
    if (
      discountPercentage &&
      discountPercentage >= 1 &&
      discountPercentage <= 100
    ) {
      const discount = price * (discountPercentage / 100);
      discountedPrice = price - discount;
    }

    const productData = {
      owner: ownerId, // assuming user is authenticated and req.user contains user information
      name,
      imageUrl: urlImage,
      category: category._id,
      condition: condition,
      description,
      price,
      quantity,
      weight,
      guarantee,
      address,
      madeIn,
      year,
      discountPercentage,
      priceAfterDiscount: discountedPrice,
      country: country,
      color,
    };

    if (req.files["productimages"]) {
      const productImages = req.files["productimages"];
      const imageUrls = [];
      if (!productImages || !Array.isArray(productImages)) {
        return res
          .status(404)
          .json({ message: "Attached files are missing or invalid." });
      }

      for (const image of productImages) {
        if (!image) {
          return res
            .status(404)
            .json({ message: "Attached file is not an image." });
        }

        const imageUrl =
          "https://www.netzoonback.siidevelopment.com/" +
          image.path.replace(/\\/g, "/");
        imageUrls.push(imageUrl);
        productData.images = imageUrls;
      }
    }

    // Add optional fields if they exist
    if (req.files["video"]) {
      const video = req.files["video"][0];
      const urlVideo =
        "https://www.netzoonback.siidevelopment.com/" +
        video.path.replace(/\\/g, "/");
      productData.vedioUrl = urlVideo;
    }

    if (req.files["gif"]) {
      const gif = req.files["gif"][0];
      const gifUrl =
        "https://www.netzoonback.siidevelopment.com/" +
        gif.path.replace(/\\/g, "/");
      productData.gifUrl = gifUrl;
    }

    const product = new Product(productData);
    const savedProduct = await product.save();

    category.products.push(savedProduct._id);
    await category.save();

    return res.status(201).json(savedProduct._id);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error });
  }
};

export const editProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      name,
      condition,
      description,
      price,
      quantity,
      weight,
      guarantee,
      address,
      madeIn,
      year,
      color,
      discountPercentage,
    } = req.body;

    const productdata = await Product.findById(productId);
    if (req.userId != productdata.owner) {
      return res.status(403).json("Error in Authurization");
    }
    let discountedPrice = price;
    if (discountPercentage != null) {
      if (
        discountPercentage &&
        discountPercentage >= 1 &&
        discountPercentage <= 100
      ) {
        const discount = price * (discountPercentage / 100);
        discountedPrice = price - discount;
      }
    }
    let urlImage;
    if (req.files && req.files["image"]) {
      const profilePhoto = req.files["image"][0];
      urlImage =
        "https://www.netzoonback.siidevelopment.com/" +
        profilePhoto.path.replace(/\\/g, "/");
    }
    // const image = req.files['image'][0];
    // if (!image) {
    //     return res.status(404).json({ message: 'Attached file is not an image.' });
    // }

    // const urlImage = 'https://www.netzoonback.siidevelopment.com/' + image.path.replace(/\\/g, '/');
    let updatedProduct;
    if (req.files && req.files["image"]) {
      updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          name: name,
          imageUrl: urlImage,
          description: description,
          price: price,
          condition: condition,
          quantity: quantity,
          weight: weight,
          guarantee: guarantee,
          address: address,
          madeIn: madeIn,
          year: year,
          color: color,
          discountPercentage: discountPercentage,
          priceAfterDiscount: discountedPrice,
        },
        { new: true }
      );
    } else {
      updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          name: name,

          description: description,
          price: price,
          condition: condition,
          quantity: quantity,
          weight: weight,
          guarantee: guarantee,
          address: address,
          madeIn: madeIn,
          year: year,
          color: color,
          discountPercentage: discountPercentage,
          priceAfterDiscount: discountedPrice,
        },
        { new: true }
      );
    }
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Add optional fields if they exist
    if (req.files["video"]) {
      const video = req.files["video"][0];
      const urlVideo =
        "https://www.netzoonback.siidevelopment.com/" +
        video.path.replace(/\\/g, "/");
      updatedProduct.vedioUrl = urlVideo;
    }

    if (req.files["gif"]) {
      const gif = req.files["gif"][0];
      const gifUrl =
        "https://www.netzoonback.siidevelopment.com/" +
        gif.path.replace(/\\/g, "/");
      updatedProduct.gifUrl = gifUrl;
    }

    await updatedProduct.save();

    return res.status(200).json("success");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    // const product = await Product.findById(productId);

    // deleteFile(product.imageUrl);
    const deletedProduct = await Product.findByIdAndRemove(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (req.userId != deletedProduct.owner) {
      return res.status(403).json("Error in Authurization");
    }
    return res.status(200).json("success");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error });
  }
};

export const getUserProducts = async (req, res) => {
  const { userId } = req.params;
  const ownerId = new mongoose.Types.ObjectId(userId); // Convert userId to ObjectId

  try {
    const products = await Product.find({ owner: ownerId })
      .populate("category", "name")
      .populate("owner", "-password");
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const rateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, userId, review } = req.body;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyRated = existingProduct.ratings.some(rate =>
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
    existingProduct.ratings.push({ user: userId, rating, review });
    existingProduct.totalRatings += 1;

    // Calculate the average rating
    const totalRatingSum = existingProduct.ratings.reduce(
      (sum, rate) => sum + rate.rating,
      0
    );
    existingProduct.averageRating =
      totalRatingSum / existingProduct.totalRatings;

    await existingProduct.save();
    res.json({
      message: "Product rated successfully",
      updatedProduct: existingProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsReviews = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the company service with the given ID exists
    const existingProduct = await Product.findById(id).populate({
      path: "ratings",
      populate: {
        path: "user",
        select: ["username", "userType"],
      },
    });
    if (!existingProduct) {
      return res.status(404).json({ message: "Company service not found" });
    }

    res.json(existingProduct.ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getProductTotalRating = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the company service with the given ID exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Company service not found" });
    }

    res.json({ averageRating: existingProduct.averageRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    let queryParams = {};
    const { keyword, country } = req.query;
    const regex = new RegExp(keyword, "i");
    queryParams.name = regex;
    if (country) queryParams.country = country;
    const suggestions = await Product.find(queryParams)
      .limit(PAGINATION_LIMIT)
      .populate("category", "name")
      .populate("owner", "username userType");
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
