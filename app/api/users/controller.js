const User = require("./model");
const { StatusCodes } = require("http-status-codes");
const CustomAPI = require("../../errors");
const { storage } = require("../../middleware/multer");
const cloudinary = require('cloudinary').v2;

const getAllUser = async (req, res, next) => {
  try {
    const user = await User.find();
    return res.status(StatusCodes.OK).json({
      message: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
const getOneUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      throw new CustomAPI.NotFoundError("User not Found");
    }

    return res.status(StatusCodes.OK).json({
      message: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateInfoUser = async (req, res, next) => {
  try {

    const { userId: idUser } = req.user;
    const user = await User.findOne({ _id: idUser });

    if (!user) {
      throw new CustomAPI.NotFoundError("User not Found");
    }

    const { username, no_telpon } = req.body;

    if (!req.file) {
      user.username = username;
      user.no_telpon = no_telpon;
    } else {
      // Delete previous avatar from Cloudinary if not default
      if (user.avatar !== "default.png" && user.avatar) {
        await cloudinary.uploader.destroy(user.avatar);
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(
        req.file.path,
        {
            folder: "uploads", // Change this to your desired folder name in Cloudinary
            allowedFormats: ["jpg", "jpeg", "png"],
            overwrite: true,
          }
      );

      user.username = username;
      user.no_telpon = no_telpon;
      user.avatar = cloudinaryResponse.public_id
      user.avatarUrl = cloudinaryResponse.secure_url; // Store full URL
    }

    // console.log("user >> ", user)
    const updatedUser = await User.findOneAndUpdate({ _id: idUser }, user);

    return res.status(StatusCodes.OK).json({
      message: "update user success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    if (!user) {
      throw new CustomAPI.BadRequestError("User Not found to deleted");
    }


    // Delete avatar from Cloudinary if not default
    if (user.avatar !== "default.png" && user.avatar) {
      await cloudinary.uploader.destroy(user.avatar);
    }

    await User.deleteOne({ _id: id });

    return res.status(StatusCodes.OK).json({
      message: "Delete Account Success",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUser,
  getOneUser,
  updateInfoUser,
  deleteUser,
};
