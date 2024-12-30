const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const {
  createAdminProduct,
  getAdminProducts,
  getAdminProductById,
  deleteAdminProductById,
  updateAdminProductById,

  getFarmerProducts,
  getFarmerProductById,
  requestFarmerMoreProducts,
} = require("../controllers/productController");

// router.use(authenticate);
// router.post("/product", authenticate, authorize("admin"), createAdminProduct);
// router.get("/products", authenticate, authorize("admin"), getAdminProducts);
// router.get(
//   "/product/:id",
//   authenticate,
//   authorize("admin"),
//   getAdminProductById
// );
// router.delete(
//   "/product/:id",
//   authenticate,
//   authorize("admin"),
//   deleteAdminProductById
// );
// router.patch(
//   "/product/:id",
//   authenticate,
//   authorize("admin"),
//   updateAdminProductById
// );

// FarmerProducstAPIs

// Get all products for the logged-in farmer
router.get("/productsgetfarmer", getFarmerProducts);
router.get("/productfarmer/:id", getFarmerProductById);
router.post("/productfarmer/request", requestFarmerMoreProducts);

module.exports = router;
