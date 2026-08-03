const Property = require("../models/Property");

// @desc    Create new property
// @route   POST /api/properties
// @access  Private
const createProperty = async (req, res, next) => {
  try {
    const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];

    const property = await Property.create({
      ...req.body,
      amenities: req.body.amenities ? JSON.parse(req.body.amenities) : [],
      images,
      owner: req.user._id,
      ownerContact: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
      },
    });

    res.status(201).json(property);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all properties with search, filters & pagination
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res, next) => {
  try {
    const {
      keyword,
      city,
      state,
      propertyType,
      purpose,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      furnished,
      parking,
      status,
      page = 1,
      limit = 9,
      sort = "-createdAt",
    } = req.query;

    const query = { isActive: true };

    if (keyword) {
      query.$text = { $search: keyword };
    }
    if (city) query.city = new RegExp(city, "i");
    if (state) query.state = new RegExp(state, "i");
    if (propertyType) query.propertyType = propertyType;
    if (purpose) query.purpose = purpose;
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
    if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };
    if (furnished) query.furnished = furnished;
    if (parking) query.parking = parking === "true";
    if (status) query.status = status;
    else query.status = "Available"; // default: only show available on public listing

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (minArea || maxArea) {
      query.area = {};
      if (minArea) query.area.$gte = Number(minArea);
      if (maxArea) query.area.$lte = Number(maxArea);
    }

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.max(Number(limit), 1);
    const skip = (pageNum - 1) * limitNum;

    const [properties, total] = await Promise.all([
      Property.find(query).sort(sort).skip(skip).limit(limitNum),
      Property.countDocuments(query),
    ]);

    res.json({
      properties,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      totalResults: total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured properties (for home page)
// @route   GET /api/properties/featured
// @access  Public
const getFeaturedProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({
      isFeatured: true,
      isActive: true,
      status: "Available",
    }).limit(8);
    res.json(properties);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property by ID (+ similar properties)
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "owner",
      "name email phone"
    );

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    property.views += 1;
    await property.save();

    const similarProperties = await Property.find({
      _id: { $ne: property._id },
      city: property.city,
      propertyType: property.propertyType,
      isActive: true,
    }).limit(4);

    res.json({ property, similarProperties });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (owner or admin)
const updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const isOwner = property.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this property" });
    }

    const newImages = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];
    const updateData = { ...req.body };
    if (req.body.amenities) updateData.amenities = JSON.parse(req.body.amenities);
    if (newImages.length > 0) {
      updateData.images = [...property.images, ...newImages];
    }

    const updated = await Property.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (owner or admin)
const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const isOwner = property.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this property" });
    }

    await property.deleteOne();
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get properties listed by logged-in user
// @route   GET /api/properties/my-listings
// @access  Private
const getMyProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort("-createdAt");
    res.json(properties);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProperty,
  getProperties,
  getFeaturedProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getMyProperties,
};
