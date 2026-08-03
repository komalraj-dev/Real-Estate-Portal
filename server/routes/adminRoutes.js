const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  toggleBlockUser,
  deleteUser,
  getAllPropertiesAdmin,
  updatePropertyStatus,
  togglePropertyActive,
  togglePropertyFeatured,
  deletePropertyAdmin,
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

router.use(protect, admin); // every route below requires an authenticated admin

router.get("/stats", getDashboardStats);

router.get("/users", getUsers);
router.put("/users/:id/block", toggleBlockUser);
router.delete("/users/:id", deleteUser);

router.get("/properties", getAllPropertiesAdmin);
router.put("/properties/:id/status", updatePropertyStatus);
router.put("/properties/:id/toggle-active", togglePropertyActive);
router.put("/properties/:id/toggle-featured", togglePropertyFeatured);
router.delete("/properties/:id", deletePropertyAdmin);

module.exports = router;
