const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  urlDB: process.env.MONGODB_URL,
  jwtSecret: process.env.JWT_SECRET_KEY,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};
