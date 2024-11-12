// External imports
const express = require("express");

// Internal imports
const apartmentController = require("../controllers/apartmentController");

// Initialize the router
const router = express.Router();

/**
 * @route   GET /api/apartments
 * @desc    Retrieve all apartments
 * @access  Public
 */
router.get("/", apartmentController.getAllApartments);

/**
 * @route   GET /api/apartments/:location
 * @desc    Retrieve all apartments by location
 * @access  Public
 */
router.get("/:location", apartmentController.getAllApartmentsByLocation);

/**
 * @route   GET /api/apartments/details/:id
 * @desc    Retrieve a single apartment details by ID
 * @access  Public
 */
router.get("/details/:id", apartmentController.getApartmentDetailstById);

/**
 * @route   POST /api/apartments
 * @desc    Create a new apartment
 * @access  Public
 */
router.post("/", apartmentController.createApartment);

/**
 * @route   PUT /api/apartments/:id
 * @desc    Update an existing apartment by ID
 * @access  Public
 */
router.put("/:id", apartmentController.updateApartment);

/**
 * @route   DELETE /api/apartments/:id
 * @desc    Delete an existing apartment by ID
 * @access  Public
 */
router.delete("/:id", apartmentController.deleteApartment);

// Export the router
module.exports = router;
