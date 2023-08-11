const express = require("express");
const {
  getAllProducts,
  createProduct,
  getOneProduct,
  updateProduct,
  deleteProduct,
} = require("./controller");
const router = express.Router();
const uploadMiddleware = require("../../middleware/multer");

router.get("/", getAllProducts);
router.get("/:id", getOneProduct);
router.delete("/:id", deleteProduct);
router.put(
  "/:id",
  uploadMiddleware.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  updateProduct
);
router.post(
  "/",
  uploadMiddleware.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  createProduct
);

module.exports = router;
