const express = require("express");
const router = express.Router();
const {
  createProperty,
  getProperties,
  getFeaturedProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getMyProperties,
} = require("../controllers/propertyController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Specific routes BEFORE dynamic /:id route to avoid conflicts
router.get("/featured", getFeaturedProperties);
router.get("/my-listings", protect, getMyProperties);

router
  .route("/")
  .get(getProperties)
  .post(protect, upload.array("images", 10), createProperty);

router
  .route("/:id")
  .get(getPropertyById)
  .put(protect, upload.array("images", 10), updateProperty)
  .delete(protect, deleteProperty);

module.exports = router;
