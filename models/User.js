// External imports
const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [
        /^\+?[1-9]\d{1,14}$/, // International phone number format (+880156835944)
        "Please enter a valid phone number",
      ],
    },

    avatar: {
      type: String,
      default: "https://avatar.iran.liara.run/public/boy",
      validate: {
        validator: function (v) {
          return /^https:\/\//.test(v); // Ensures the URL starts with https://
        },
        message: 'Avatar URL must start with "https://"',
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long",
      ],
    },

    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: 'Role must be either "user" or "admin"',
      },
      default: "user",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create the User model
const User = mongoose.model("User", userSchema);

// Export the model
module.exports = User;
