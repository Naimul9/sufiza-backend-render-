// Internal imports
const User = require("../models/User");

/**
 * @route   GET /api/users
 * @desc    Retrieve all users
 * @access  Public
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

/**
 * @route   GET /api/users/:id
 * @desc    Retrieve a single user by ID
 * @access  Public
 */
exports.getUserDetailsById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid User ID format" });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch User",
    });
  }
};

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Public
 */
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      message: "User created successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ success: false, message: "Failed to create user" });
  }
};

/**
 * @route   PUT /api/users/:id
 * @desc    Update an existing user by ID
 * @access  Public
 */
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate before updating
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid User ID format" });
    }

    res.status(500).json({ success: false, message: "Failed to update User" });
  }
};

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete an existing user by ID
 * @access  Public
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid User ID format" });
    }

    res.status(500).json({ success: false, message: "Failed to delete User" });
  }
};
