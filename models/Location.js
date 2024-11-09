// External imports
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Division schema
const divisionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Division name is required."],
      trim: true,
    },
  },
  { _id: false } // Disables the _id field for division Schema
);

// Define the District schema
const districtSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "District name is required."],
      trim: true,
    },
  },
  { _id: false } // Disables the _id field for district Schema
);

// Define the Country schema
const countrySchema = new Schema(
  {
    country: {
      type: String,
      required: [true, "Country name is required."],
      unique: true, // Ensure that the country name is unique
      trim: true,
    },
    division: {
      type: [divisionSchema], // Array of divisions
      validate: {
        validator: (divisions) => divisions.length > 0,
        message: "At least one division is required.",
      },
    },
    district: {
      type: [districtSchema], // Array of districts
      validate: {
        validator: (districts) => districts.length > 0,
        message: "At least one district is required.",
      },
    },
  },
  {
    timestamps: true, // Automatically includes createdAt and updatedAt fields
    versionKey: false, // Disables the __v field for document versioning
  }
);

// Create the Location model
const Location = mongoose.model("Location", countrySchema);

// Export the model
module.exports = Location;
