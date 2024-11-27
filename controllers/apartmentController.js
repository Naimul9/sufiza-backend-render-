// Internal imports
const Apartment = require("../models/Apartment");

/**
 * @route   GET /api/apartments
 * @desc    Retrieve all apartments
 * @access  Public
 */
exports.getAllApartments = async (req, res) => {
  try {
    // destructure query parameters with default values
    const {
      country,
      districts,
      division,
      objective,
      page = 0,
      size = 6,
      propertieRange,
      sortPropertie,
    } = req.query;

    // pagination settings
    const perPageProducts = parseInt(size);
    const currentPage = parseInt(page);
    const skipProducts = currentPage * perPageProducts;

    // the query object
    const query = {};

    // Search by country
    if (country && country.toLowerCase() !== "all") {
      query["address.country"] = { $regex: country, $options: "i" };
    }

    // Search by division
    if (
      division &&
      division.toLowerCase() !== "all" &&
      country.toLowerCase() !== "all"
    ) {
      query["address.division"] = { $regex: division, $options: "i" };
    }

    // Search by districts
    if (
      districts &&
      districts.toLowerCase() !== "all" &&
      country.toLowerCase() !== "all"
    ) {
      query["address.districtsOrThana"] = { $regex: districts, $options: "i" };
    }

    // Search by objective (buy, rent, sell)
    if (objective && objective.toLowerCase() !== "all") {
      query["objective.status"] = { $regex: objective, $options: "i" };
    }

    // Filter by property type (residential, commercial)
    if (sortPropertie && sortPropertie.toLowerCase() !== "all") {
      query["properties.type"] = { $regex: sortPropertie, $options: "i" };
    }

    // filter by property size range
    if (propertieRange) {
      const [min, max] = propertieRange
        .split("-")
        .map((value) => Number(value));
      query["apartmentDetails.size"] = { $gte: min, $lte: max };
    }

    // count total apartments matching the query
    const totalApartmentsNumber = await Apartment.countDocuments(query);

    // find apartments with pagination
    const apartments = await Apartment.find(query)
      .skip(skipProducts)
      .limit(perPageProducts);

    console.log(query);
    // console.log(apartments);

    res.status(200).json({
      success: true,
      message: "Apartment fetch successfully",
      totalApartments: totalApartmentsNumber,
      data: apartments,
    });
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

    res.status(200).json({
      success: true,
      message: "Apartment fetch successfully",
      data: apartment,
    });
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

    res.status(201).json({
      success: true,
      message: "Apartment created successfully",
      data: apartment,
    });
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

    res.status(200).json({
      success: true,
      message: "Apartment updated successfully",
      data: apartment,
    });
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
