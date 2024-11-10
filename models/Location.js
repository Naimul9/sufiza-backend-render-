// External imports
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the District schema
const districtSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "District name is required."],
      trim: true,
    },
  },
  { _id: false }
);

// Define the Division schema
const divisionSchema = new Schema({
  name: {
    type: String,
    required: [true, "Division name is required."],
    trim: true,
  },
  districts: [districtSchema],
});

// Define the Country schema
const countrySchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: [true, "Country name is required."],
      trim: true,
    },
    divisions: [divisionSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create the Location model
const Location = mongoose.model("Location", countrySchema);

// Export the model
module.exports = Location;
