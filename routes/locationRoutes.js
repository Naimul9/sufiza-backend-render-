// External imports
const express = require("express");

// Internal imports
const locationController = require("../controllers/locationController");

// Initialize the router
const router = express.Router();

/**
 * @route   GET /api/locations/countrys
 * @desc    Retrieve all countrys
 * @access  Public
 */
router.get("/countrys", locationController.getAllCountrys);

/**
 * @route   GET /api/locations/divisions/:id
 * @desc    Retrieve all divisions by country ID
 * @access  Public
 */
router.get("/divisions/:id", locationController.getAllDivisionsByCountryId);

/**
 * @route   GET /api/locations/districts/:id
 * @desc    Retrieve all districts by country ID
 * @access  Public
 */
router.get("/districts/:id", locationController.getAllDistrictsByCountryId);

/**
 * @route   POST /api/locations
 * @desc    Create a new location
 * @access  Public
 */
router.post("/", locationController.createLocation);

/**
 * @route   PUT /api/locations/:id
 * @desc    Update an existing location by ID
 * @access  Public
 */
router.put("/:id", locationController.updateLocation);

/**
 * @route   DELETE /api/locations/:id
 * @desc    Delete an existing location by ID
 * @access  Public
 */
router.delete("/:id", locationController.deleteLocation);

// Export the router
module.exports = router;
