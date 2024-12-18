// Internal imports
const Location = require("../models/Location");

/**
 * @route   GET /api/locations/countrys
 * @desc    Retrieve all countrys
 * @access  Public
 */
exports.getAllCountrys = async (req, res) => {
  try {
    const result = await Location.find().select("country");

    if (result) {
      let countrys = [{ value: "All", label: "All" }];

      for (let { country, id } of result) {
        countrys.push({
          value: country,
          label: country,
          _id: id,
        });
      }

      res.status(200).json({ success: true, data: countrys });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch locations" });
  }
};

/**
 * @route   GET /api/locations/:countryId/divisions
 * @desc    Retrieve all divisions by country ID
 * @access  Public
 */
exports.getAllDivisionsByCountryId = async (req, res) => {
  try {
    const divisions = await Location.findById(req.params.countryId).select(
      "divisions.name divisions._id"
    );

    if (!divisions) {
      return res
        .status(404)
        .json({ success: false, message: "Country division not found" });
    }

    res.status(200).json({ success: true, data: divisions });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid country ID format" });
    }

    res
      .status(500)
      .json({ success: false, message: "Failed to fetch country division" });
  }
};

/**
 * @route   GET /api/locations/:countryId/divisions/:divisionId/districts
 * @desc    Retrieve all districts by country ID & division ID
 * @access  Public
 */
exports.getAllDistrictsByCountryAndDivisionId = async (req, res) => {
  try {
    const country = await Location.findOne({
      _id: req.params.countryId,
      "divisions._id": req.params.divisionId,
    });

    if (!country || !country.divisions.length) {
      return res
        .status(404)
        .json({ success: false, message: "Division district not found" });
    }

    const division = country?.divisions.id(req.params.divisionId);
    res.status(200).json({ success: true, data: division });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid country ID format" });
    }
    res.status(500).json({
      success: false,
      message: "Failed to fetch division districts",
    });
  }
};

/**
 * @route   POST /api/locations
 * @desc    Create a new location
 * @access  Public
 */
exports.createLocation = async (req, res) => {
  try {
    const location = await Location.create(req.body);

    res.status(201).json({ success: true, data: location });
  } catch (error) {
    console.log({ error });
    res
      .status(500)
      .json({ success: false, message: "Failed to create location" });
  }
};

/**
 * @route   PUT /api/locations/:id
 * @desc    Update an existing location by ID
 * @access  Public
 */
exports.updateLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate before updating
    });

    if (!location) {
      return res
        .status(404)
        .json({ success: false, message: "Location not found" });
    }

    res.status(200).json({ success: true, data: location });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid location ID format" });
    }

    res
      .status(500)
      .json({ success: false, message: "Failed to update location" });
  }
};

/**
 * @route   DELETE /api/locations/:id
 * @desc    Delete an existing location by ID
 * @access  Public
 */
exports.deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);

    if (!location) {
      return res
        .status(404)
        .json({ success: false, message: "Location not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Location deleted successfully" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid location ID format" });
    }

    res
      .status(500)
      .json({ success: false, message: "Failed to delete location" });
  }
};
