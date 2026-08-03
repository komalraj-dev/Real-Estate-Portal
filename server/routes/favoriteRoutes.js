const express = require("express");
const router = express.Router();
const {
  addFavorite,
  removeFavorite,
  getFavorites,
} = require("../controllers/favoriteController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getFavorites);
router.post("/:propertyId", protect, addFavorite);
router.delete("/:propertyId", protect, removeFavorite);

module.exports = router;
