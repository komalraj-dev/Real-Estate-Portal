const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },

    // Location
    address: { type: String, required: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, default: "" },
    location: {
      // for future map integration (lat/lng)
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },

    // Classification
    propertyType: {
      type: String,
      required: true,
      enum: [
        "Flat",
        "Apartment",
        "Villa",
        "Bungalow",
        "House",
        "Commercial",
        "Land",
      ],
    },
    purpose: {
      type: String,
      required: true,
      enum: ["Sale", "Rent"],
    },

    // Specifications
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    area: { type: Number, required: true }, // in sq. ft.
    parking: { type: Boolean, default: false },
    furnished: {
      type: String,
      enum: ["Furnished", "Semi-Furnished", "Unfurnished"],
      default: "Unfurnished",
    },

    // Amenities / Features
    amenities: [{ type: String }], // e.g. ["Swimming Pool", "Gym", "Lift"]

    // Media
    images: [{ type: String }], // array of image URLs / paths

    // Status
    status: {
      type: String,
      enum: ["Available", "Sold", "Rented"],
      default: "Available",
    },
    isActive: {
      type: Boolean,
      default: true, // allows admin to activate/deactivate listing
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Ownership
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ownerContact: {
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
    },

    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text index to support keyword search across key fields
propertySchema.index({
  title: "text",
  description: "text",
  city: "text",
  state: "text",
  address: "text",
});

module.exports = mongoose.model("Property", propertySchema);
