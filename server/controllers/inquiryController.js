const Inquiry = require("../models/Inquiry");
const Property = require("../models/Property");

// @desc    Send inquiry / contact owner about a property
// @route   POST /api/inquiries/:propertyId
// @access  Public
const createInquiry = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email and message are required" });
    }

    const inquiry = await Inquiry.create({
      property: property._id,
      sender: req.user ? req.user._id : null,
      name,
      email,
      phone,
      message,
    });

    res.status(201).json({ message: "Inquiry sent successfully", inquiry });
  } catch (error) {
    next(error);
  }
};

module.exports = { createInquiry };
