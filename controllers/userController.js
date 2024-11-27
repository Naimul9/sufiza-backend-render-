// Internal imports
const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/passwordManager");
const { generateTokens, verifyRefreshToken } = require("../utils/token");

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
    const userIsAvailable = await User.findOne({
      email: req.body.email,
    });

    if (userIsAvailable) {
      return res
        .status(500)
        .json({ success: false, message: "You are already registered." });
    }

    const password = await hashPassword(req.body.password);

    const user = await User.create({
      ...req.body,
      password,
    });

    res.status(201).json({
      message: "User created successfully",
      success: true,
      data: user,
    });
  } catch (error) {
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

/**
 * @route   POST /api/users/login
 * @desc    An register user login
 * @access  Public
 */
exports.userLogin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user || !(await comparePassword(req.body.password, user?.password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Store tokens to browser cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // cookie accessible only by the web server
      secure: true, // ensures cookie is sent over https
      signed: true, // signs the cookie (requires cookie parser secret)
      maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
      sameSite: "none", // restricts cross-site requests (strict, lax, none)
      path: "/", // cookie valid for all paths
      domain: undefined,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // cookie accessible only by the web server
      secure: true, // ensures cookie is sent over https
      signed: true, // signs the cookie (requires cookie parser secret)
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
      sameSite: "none", // restricts cross-site requests (strict, lax, none)
      path: "/", // cookie valid for all paths
      domain: undefined,
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to logged" });
  }
};

/**
 * @route   POST /api/users/logout
 * @desc    An logged user logout
 * @access  Public
 */
exports.userLogout = async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json({ success: true, message: "Logged out successfully" });
};

/**
 * @route   POST /api/users/refresh
 * @desc    Access token refresh of a logged user
 * @access  Public
 */
exports.AccessTokenRefresh = async (req, res) => {
  const refreshToken = req.signedCookies.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const user = verifyRefreshToken(refreshToken);

    const { accessToken } = generateTokens(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true, // cookie accessible only by the web server
      secure: true, // ensures cookie is sent over https
      signed: true, // signs the cookie (requires cookie parser secret)
      maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
      sameSite: "none", // restricts cross-site requests (strict, lax, none)
      path: "/", // cookie valid for all paths
      domain: undefined, // cookie valid for any domain
    });

    res.status(200).json({ success: true, message: "Access token refreshed" });
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
