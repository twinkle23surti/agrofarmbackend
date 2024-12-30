const express = require("express");
// const { authenticate, authorize } = require("../middlewares/authMiddleware");
const {
  createFarmer,
  getAllFarmers,
  getFarmerById,
  deleteFarmer,
  updateFarmer,
} = require("../controllers/adminController");

const router = express.Router();

// router.use(authenticate);
// router.post("/createFarmer",authenticate, authorize("admin"), createFarmer);
// router.get("/farmers", authenticate ,authorize("admin"), getAllFarmers);
// router.get("/farmers/:id", authenticate, authorize("admin"), getFarmerById);
// router.delete("/farmers/:id",authenticate,authorize("admin"), deleteFarmer);
// router.patch("/farmers/:id",authenticate , authorize("admin"), updateFarmer);

//router.use(authenticate);
router.post("/createFarmer", createFarmer);
router.get("/farmers", getAllFarmers);
router.get("/farmers/:id", getFarmerById);
router.delete("/farmers/:id", deleteFarmer);
router.patch("/farmers/:id", updateFarmer);

module.exports = router;
