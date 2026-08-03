// Run with: npm run seed
// Creates one admin account and a handful of sample properties so the app
// has real data to show right after setup.
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");
const Property = require("./models/Property");

dotenv.config();

const run = async () => {
  await connectDB();

  const adminEmail = "admin@realestate.com";
  let admin = await User.findOne({ email: adminEmail });

  if (!admin) {
    admin = await User.create({
      name: "Admin",
      email: adminEmail,
      password: "admin123",
      role: "admin",
      phone: "9999999999",
    });
    console.log("Admin created -> email: admin@realestate.com / password: admin123");
  } else {
    console.log("Admin already exists, skipping.");
  }

  const existingCount = await Property.countDocuments();
  if (existingCount === 0) {
    const sampleProperties = [
      {
        title: "Modern 3BHK Apartment in City Center",
        description:
          "A spacious, sunlit apartment with premium fittings, close to schools and metro access.",
        price: 8500000,
        address: "MG Road",
        city: "Bengaluru",
        state: "Karnataka",
        propertyType: "Apartment",
        purpose: "Sale",
        bedrooms: 3,
        bathrooms: 2,
        area: 1450,
        parking: true,
        furnished: "Semi-Furnished",
        amenities: ["Lift", "Power Backup", "Security", "Gym"],
        images: [],
        status: "Available",
        isFeatured: true,
        owner: admin._id,
        ownerContact: { name: admin.name, email: admin.email, phone: admin.phone },
      },
      {
        title: "Luxury Villa with Private Garden",
        description:
          "An elegant 4BHK villa with a private garden, swimming pool, and dedicated parking for 2 cars.",
        price: 22000000,
        address: "Whitefield",
        city: "Bengaluru",
        state: "Karnataka",
        propertyType: "Villa",
        purpose: "Sale",
        bedrooms: 4,
        bathrooms: 4,
        area: 3200,
        parking: true,
        furnished: "Furnished",
        amenities: ["Swimming Pool", "Garden", "Security", "Club House"],
        images: [],
        status: "Available",
        isFeatured: true,
        owner: admin._id,
        ownerContact: { name: admin.name, email: admin.email, phone: admin.phone },
      },
      {
        title: "Cozy 2BHK Flat for Rent",
        description:
          "Well-ventilated 2BHK flat near IT park, ideal for working professionals.",
        price: 25000,
        address: "Hinjewadi Phase 2",
        city: "Pune",
        state: "Maharashtra",
        propertyType: "Flat",
        purpose: "Rent",
        bedrooms: 2,
        bathrooms: 2,
        area: 980,
        parking: true,
        furnished: "Semi-Furnished",
        amenities: ["Lift", "Water Supply", "Security"],
        images: [],
        status: "Available",
        isFeatured: true,
        owner: admin._id,
        ownerContact: { name: admin.name, email: admin.email, phone: admin.phone },
      },
      {
        title: "Independent House with Terrace",
        description:
          "Traditional independent house with a spacious terrace, perfect for a joint family.",
        price: 6500000,
        address: "Anna Nagar",
        city: "Chennai",
        state: "Tamil Nadu",
        propertyType: "House",
        purpose: "Sale",
        bedrooms: 3,
        bathrooms: 3,
        area: 1800,
        parking: true,
        furnished: "Unfurnished",
        amenities: ["Terrace", "Borewell"],
        images: [],
        status: "Available",
        isFeatured: false,
        owner: admin._id,
        ownerContact: { name: admin.name, email: admin.email, phone: admin.phone },
      },
      {
        title: "Commercial Office Space",
        description:
          "Prime commercial space suitable for offices or showrooms in a high-footfall area.",
        price: 45000,
        address: "Connaught Place",
        city: "New Delhi",
        state: "Delhi",
        propertyType: "Commercial",
        purpose: "Rent",
        bedrooms: 0,
        bathrooms: 2,
        area: 2100,
        parking: true,
        furnished: "Unfurnished",
        amenities: ["Lift", "Power Backup", "CCTV"],
        images: [],
        status: "Available",
        isFeatured: false,
        owner: admin._id,
        ownerContact: { name: admin.name, email: admin.email, phone: admin.phone },
      },
      {
        title: "Residential Land Plot",
        description:
          "Clear-title residential plot in a fast-developing suburb, ready for construction.",
        price: 3200000,
        address: "Sarjapur Road",
        city: "Bengaluru",
        state: "Karnataka",
        propertyType: "Land",
        purpose: "Sale",
        bedrooms: 0,
        bathrooms: 0,
        area: 2400,
        parking: false,
        furnished: "Unfurnished",
        amenities: ["Gated Layout"],
        images: [],
        status: "Available",
        isFeatured: false,
        owner: admin._id,
        ownerContact: { name: admin.name, email: admin.email, phone: admin.phone },
      },
    ];

    await Property.insertMany(sampleProperties);
    console.log(`${sampleProperties.length} sample properties created.`);
  } else {
    console.log("Properties already exist, skipping sample data.");
  }

  console.log("Seeding complete.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
