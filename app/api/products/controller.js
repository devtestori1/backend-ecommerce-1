const { StatusCodes } = require("http-status-codes");

const CustomAPI = require("../../errors");
const Product = require("./model");
const Category = require("../category/model");
const cloudinary = require("cloudinary").v2
const getAllProducts = async (req, res, next) => {
  try {
    const { keyword } = req.query;
    let condition = {};
    if (keyword) {
      condition = { ...condition, name: { $regex: keyword, $options: "i" } };
    }

    const allProducts = await Product.find(condition).populate({
      path: "category",
      select: "category_name",
    });

    return res.status(StatusCodes.OK).json({
      message: "Success",
      data: allProducts,
    });
  } catch (error) {
    next(error);
  }
};

const getOneProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id }).populate({
      path: "category",
      select: "category_name",
    });
    if (!product) {
      throw new CustomAPI.NotFoundError("Product not found");
    }

    return res.status(StatusCodes.OK).json({
      message: "Success",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, description, purchase_price, sell_price, stock, category } =
      req.body;
    const checkCategory = await Category.findOne({ _id: category });
    if (!checkCategory) {
      throw new CustomAPI.BadRequestError("No Category Found");
    }
    if (!req.files || !req.files["thumbnail"]) {
      throw new CustomAPI.BadRequestError("Thumbnail must be uploaded");
    }

    const thumbnailUrl = req.files["thumbnail"][0].path;
    const thumbnail = req.files["thumbnail"][0].filename;

    let image1Url = "";
    let image1 = "";
    if (req.files["image1"]) {
      image1Url = req.files["image1"][0].path;
      image1 = req.files["image1"][0].filename;
    }

    let image2Url = "";
    let image2 = "";
    if (req.files["image2"]) {
      image2Url = req.files["image2"][0].path;
      image2 = req.files["image2"][0].filename;
    }

    const result = new Product({
      name,
      description,
      purchase_price,
      sell_price,
      stock,
      thumbnailUrl,
      thumbnail,
      image1Url,
      image1,
      image2Url,
      image2,
      category,
    });

    await result.save();

    return res.status(StatusCodes.OK).json({
      message: "Success Create The Item",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, purchase_price, sell_price, category, stock } =
      req.body;

    const result = await Product.findOne({ _id: id });

    if (!result) {
      throw new CustomAPI.NotFoundError("Not Found Product");
    }

    const checkCategory = await Category.findOne({ _id: category });
    

    if (!req.files) {
      if (!checkCategory) {
        throw new CustomAPI.BadRequestError("No Category Found");
      }
      result.name = name;
      result.description = description;
      result.purchase_price = purchase_price;
      result.sell_price = sell_price;
      result.category = category;
      result.stock = stock;
    } else {
      const checkImg1 = req.files["image1"] ? true : false;
      const checkImg2 = req.files["image2"] ? true : false;
      const checkThumbnail = req.files["thumbnail"] ? true : false;

      if (checkThumbnail) {
        await cloudinary.uploader.destroy(result.thumbnail);
        result.thumbnail = req.files["thumbnail"][0].filename;
        result.thumbnailUrl = req.files["thumbnail"][0].path;
      }
      if (checkImg1) {
        await cloudinary.uploader.destroy(result.image1);
        result.image1 = req.files["image1"][0].filename;
        result.image1Url = req.files["image1"][0].path;
      }

      if (checkImg2) {
        await cloudinary.uploader.destroy(result.image2);
        result.image2 = req.files["image2"][0].filename;
        result.image2Url = req.files["image2"][0].path;
      }

      result.name = name;
      result.description = description;
      result.purchase_price = purchase_price;
      result.sell_price = sell_price;
      result.category = category;
      result.stock = stock;

      await result.save();
      return res.status(StatusCodes.OK).json({
        message: "Success Updated The Product",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await Product.findOne({ _id: id });

    if (!result) {
      throw new CustomAPI.NotFoundError("Not Found Product");
    }

    const checkImg1 = result.image1 ? true : false;
    const checkImg2 = result.image2 ? true : false;
    const checkThumbnail = result.thumbnail ? true : false;

    if (checkThumbnail) {
      await cloudinary.uploader.destroy(result.thumbnail);
    }
    if (checkImg1) {
      await cloudinary.uploader.destroy(result.image1);
    }

    if (checkImg2) {
      await cloudinary.uploader.destroy(result.image2);
    }

    await Product.deleteOne({ _id: id });
    return res.status(StatusCodes.OK).json({
      message: "Success Deleted Item",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  getOneProduct,
  updateProduct,
  deleteProduct
};
