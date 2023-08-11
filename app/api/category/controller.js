const Category = require("./model");
const { StatusCodes } = require("http-status-codes");
const CustomAPI = require("../../errors");

const getAllCategory = async (req, res, next) => {
  try {
    const result = await Category.find();
    return res.status(StatusCodes.OK).json({
      message: "Success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { category_name } = req.body;
    const category = await Category.create({
      category_name  : String(category_name).toLowerCase(),
    });

    return res.status(StatusCodes.OK).json({
      message: "Success Create Category",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

const getOneCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Category.findOne({ _id: id });
    if (!result) {
      throw new CustomAPI.NotFoundError("Category Not Found");
    }
    return res.status(StatusCodes.OK).json({
      message: "Success Found Category",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category_name } = req.body;
    const category = await Category.findOne({_id : id})
    if(!category){
        throw new CustomAPI.NotFoundError("Category Not Found")
    }
    category.category_name = String(category_name).toLowerCase();
    await category.save();

    return res.status(StatusCodes.OK).json({
        message : "Success Update Data",
        data : category
    })
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({_id : id})
    if(!category){
        throw new CustomAPI.NotFoundError("Category Not Found")
    }
    await Category.deleteOne({_id : id})

    return res.status(StatusCodes.OK).json({
        message : "Success Delete Data",
        data : category
    })
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategory,
  createCategory,
  getOneCategory,
  updateCategory,
  deleteCategory
};