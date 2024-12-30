// const { authenticate, authorize } = require("../middlewares/authMiddleware");
//const {isAdmin ,isFarmer} = require("../middlewares/roleMiddleware");
const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

//  router.post("/register", authenticate, authorize("admin"), register);
// router.post("/login", login);

module.exports = router;
