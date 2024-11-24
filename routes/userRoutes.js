// External imports
const express = require("express");

// Internal imports
const userController = require("../controllers/userController");

// Initialize the router
const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Retrieve all users
 * @access  Public
 */
router.get("/", userController.getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Retrieve a single user by ID
 * @access  Public
 */
router.get("/:id", userController.getUserDetailsById);

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Public
 */
router.post("/", userController.createUser);

/**
 * @route   PUT /api/users/:id
 * @desc    Update an existing user by ID
 * @access  Public
 */
router.put("/:id", userController.updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete an existing user by ID
 * @access  Public
 */
router.delete("/:id", userController.deleteUser);

// Export the router
module.exports = router;
