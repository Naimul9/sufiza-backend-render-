// External imports
const mongoose = require("mongoose");

// Define the Apartment schema
const apartmentSchema = new mongoose.Schema(
  {
    address: {
      houseNumber: {
        type: Number,
        required: [true, "House number is required"],
      },
      road: {
        type: String,
        trim: true,
        required: [true, "Road name is required"],
      },
      area: {
        type: String,
        trim: true,
        required: [true, "Area name is required"],
      },
      divisionOrThana: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, "Division or Thana is required"],
      },
      country: {
        type: String,
        trim: true,
        required: [true, "Country is required"],
        lowercase: true,
        default: "Bangladesh",
      },
    },
    apartmentDetails: {
      images: {
        type: [String],
        required: [true, "Images field is required"],
        validate: {
          validator: function (images) {
            return images.every((image) =>
              /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/.test(image)
            );
          },
          message:
            "All images must be valid URLs with supported formats (jpg, jpeg, png, gif, webp)",
        },
      },
      size: {
        type: Number,
        required: [true, "Size in square feet is required"],
        min: [1, "Size must be at least 1 square foot"],
      },
      bedrooms: {
        type: Number,
        required: [true, "Number of bedrooms is required"],
        min: [1, "At least one bedroom is required"],
      },
      balconies: {
        type: Number,
        required: [true, "Number of balconies is required"],
        min: [0, "Balconies cannot be negative"],
      },
      toilets: {
        type: Number,
        required: [true, "Number of toilets is required"],
        min: [1, "At least one toilet is required"],
      },
      drawingDining: {
        type: Boolean,
        required: [true, "Drawing/dining room information is required"],
        default: false,
      },
      kitchen: {
        type: Boolean,
        required: [true, "Kitchen information is required"],
        default: false,
      },
    },
    buildingDetails: {
      floorPosition: {
        type: [String],
        validate: {
          validator: function (v) {
            return Array.isArray(v) && v.length > 0;
          },
          message: "At least one floor position is required",
        },
      },
      unitsPerFloor: {
        type: Number,
        required: [true, "Units per floor are required"],
        min: [1, "There must be at least one unit per floor"],
      },
    },
    price: {
      ratePerSft: {
        type: Number,
        required: [true, "Rate per square foot is required"],
      },
      currency: {
        type: String,
        required: [true, "Currency is required"],
        default: "Tk",
      },
    },
    orientation: {
      type: String,
      lowercase: true,
      enum: {
        values: ["north facing", "south facing", "east facing", "west facing"],
        message:
          "Orientation must be 'north facing', 'south facing', 'east facing', or 'west facing'",
      },
    },
    completionStatus: {
      percentage: {
        type: Number,
        min: [0, "Completion percentage cannot be less than 0"],
        max: [100, "Completion percentage cannot exceed 100"],
        default: 100,
      },
      condition: {
        type: String,
        lowercase: true,
        enum: {
          values: ["new", "used"],
          message: "Condition must be either 'new' or 'used'",
        },
        required: [true, "Condition is required"],
      },
    },
    properties: {
      type: {
        type: String,
        lowercase: true,
        enum: {
          values: ["residential", "commercial"],
          message: "Property type must be 'residential' or 'commercial'",
        },
        required: [true, "Property type is required"],
      },
    },
    objective: {
      status: {
        type: String,
        lowercase: true,
        enum: {
          values: ["buy", "rent", "sell"],
          message: "Objective status must be either 'buy' or 'sale' or 'sell'",
        },
        required: [true, "Objective status is required"],
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create the Apartment model
const Apartment = mongoose.model("Apartment", apartmentSchema);

// Export the model
module.exports = Apartment;