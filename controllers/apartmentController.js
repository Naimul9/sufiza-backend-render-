// Internal imports
const Apartment = require("../models/Apartment");

/**
 * @route   GET /api/apartments
 * @desc    Retrieve all apartments
 * @access  Public
 */
exports.getAllApartments = async (req, res) => {
  try {
    const apartments = await Apartment.find().select();

    res.status(200).json({ success: true, data: apartments });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch apartments" });
  }
};

/**
 * @route   GET /api/apartments/:location
 * @desc    Retrieve all apartments by location
 * @access  Public
 */
exports.getAllApartmentsByLocation = async (req, res) => {
  try {
    const apartments = await Apartment.findOne({
      $or: [
        { "address.divisionOrThana": req.params.location },
        { "address.country": req.params.location },
      ],
    }).select();

    if (!apartments) {
      return res
        .status(404)
        .json({ success: false, message: "Apartments not found" });
    }

    res.status(200).json({ success: true, data: apartments });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch apartments" });
  }
};

/**
 * @route   GET /api/apartments/details/:id
 * @desc    Retrieve a single apartment details by ID
 * @access  Public
 */
exports.getApartmentDetailstById = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);

    if (!apartment) {
      return res
        .status(404)
        .json({ success: false, message: "Apartment not found" });
    }

    res.status(200).json({ success: true, data: apartment });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid apartment ID format" });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch apartment",
    });
  }
};

/**
 * @route   POST /api/apartments
 * @desc    Create a new apartment
 * @access  Public
 */
exports.createApartment = async (req, res) => {
  try {
    const apartment = await Apartment.create(req.body);

    res.status(201).json({ success: true, data: apartment });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create apartment" });
  }
};

/**
 * @route   PUT /api/apartments/:id
 * @desc    Update an existing apartment by ID
 * @access  Public
 */
exports.updateApartment = async (req, res) => {
  try {
    const apartment = await Apartment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate before updating
      }
    );

    if (!apartment) {
      return res
        .status(404)
        .json({ success: false, message: "Apartment not found" });
    }

    res.status(200).json({ success: true, data: apartment });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid apartment ID format" });
    }

    res
      .status(500)
      .json({ success: false, message: "Failed to update apartment" });
  }
};

/**
 * @route   DELETE /api/apartments/:id
 * @desc    Delete an existing apartment by ID
 * @access  Public
 */
exports.deleteApartment = async (req, res) => {
  try {
    const apartment = await Apartment.findByIdAndDelete(req.params.id);

    if (!apartment) {
      return res
        .status(404)
        .json({ success: false, message: "Apartment not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Apartment deleted successfully" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid apartment ID format" });
    }

    res
      .status(500)
      .json({ success: false, message: "Failed to delete apartment" });
  }
};
