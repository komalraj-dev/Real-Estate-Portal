const User = require("../models/User");
const Property = require("../models/Property");

// @desc    Get dashboard overview stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalProperties,
      totalSale,
      totalRental,
      available,
      sold,
      rented,
    ] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Property.countDocuments({ purpose: "Sale" }),
      Property.countDocuments({ purpose: "Rent" }),
      Property.countDocuments({ status: "Available" }),
      Property.countDocuments({ status: "Sold" }),
      Property.countDocuments({ status: "Rented" }),
    ]);

    res.json({
      totalUsers,
      totalProperties,
      totalSale,
      totalRental,
      available,
      sold,
      rented,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort("-createdAt");
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Block / unblock a user
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: `User ${user.isBlocked ? "blocked" : "unblocked"}`, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all properties (admin view, includes inactive)
// @route   GET /api/admin/properties
// @access  Private/Admin
const getAllPropertiesAdmin = async (req, res, next) => {
  try {
    const properties = await Property.find().populate("owner", "name email").sort("-createdAt");
    res.json(properties);
  } catch (error) {
    next(error);
  }
};

// @desc    Update property status (Available / Sold / Rented)
// @route   PUT /api/admin/properties/:id/status
// @access  Private/Admin
const updatePropertyStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["Available", "Sold", "Rented"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!property) return res.status(404).json({ message: "Property not found" });

    res.json(property);
  } catch (error) {
    next(error);
  }
};

// @desc    Activate / deactivate a listing
// @route   PUT /api/admin/properties/:id/toggle-active
// @access  Private/Admin
const togglePropertyActive = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    property.isActive = !property.isActive;
    await property.save();

    res.json(property);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle featured flag on a listing
// @route   PUT /api/admin/properties/:id/toggle-featured
// @access  Private/Admin
const togglePropertyFeatured = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    property.isFeatured = !property.isFeatured;
    await property.save();

    res.json(property);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete any property (admin override)
// @route   DELETE /api/admin/properties/:id
// @access  Private/Admin
const deletePropertyAdmin = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    await property.deleteOne();
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  toggleBlockUser,
  deleteUser,
  getAllPropertiesAdmin,
  updatePropertyStatus,
  togglePropertyActive,
  togglePropertyFeatured,
  deletePropertyAdmin,
};
