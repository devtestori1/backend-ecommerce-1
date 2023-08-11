const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const {
  cloudinary_api_key,
  cloudinary_api_secret,
  cloudinary_cloud_name,
} = require("../config");


cloudinary.config({
  cloud_name: cloudinary_cloud_name,
  api_key: cloudinary_api_key,
  api_secret: cloudinary_api_secret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Change this to your desired folder name in Cloudinary
    allowedFormats: ["jpg", "jpeg", "png", "gif"], // Allowed file formats
  },
});
const fileSizeLimit = 10 * 1024 * 1024; // For example, 10 MB

const uploadMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: fileSizeLimit,
  },
});

module.exports = uploadMiddleware;
