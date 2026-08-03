const User = require("../models/User");
const Property = require("../models/Property");

// @desc    Add property to favorites
// @route   POST /api/favorites/:propertyId
// @access  Private
const addFavorite = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const user = await User.findById(req.user._id);

    if (user.favorites.includes(req.params.propertyId)) {
      return res.status(400).json({ message: "Property already in favorites" });
    }

    user.favorites.push(req.params.propertyId);
    await user.save();

    res.status(201).json({ message: "Added to favorites", favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove property from favorites
// @route   DELETE /api/favorites/:propertyId
// @access  Private
const removeFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    user.favorites = user.favorites.filter(
      (id) => id.toString() !== req.params.propertyId
    );
    await user.save();

    res.json({ message: "Removed from favorites", favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's favorite properties
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    res.json(user.favorites);
  } catch (error) {
    next(error);
  }
};

module.exports = { addFavorite, removeFavorite, getFavorites };
