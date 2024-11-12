// External imports
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const cookieParser = require("cookie-parser");
const favicon = require("serve-favicon");

// Internal imports
const {
  notFoundHandler,
  errorHandler,
} = require("./middleware/common/errorHandler");
const connectDB = require("./config/database");
const locationRoutes = require("./routes/locationRoutes");
const apartmentRoutes = require("./routes/apartmentRoutes");

// Initialize Express application
const app = express();

// Define server port
const PORT = process.env.PORT || 5000;

// Middleware setup
// JSON body parsing
app.use(express.json());

// URL-encoded data parsing for form submissions
app.use(express.urlencoded({ extended: true }));

// CORS configuration to control access to server resources
const corsOptions = {
  origin: ["https://sufiza.netlify.app", "http://localhost:5173"], // Allowed origins
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers in requests
  credentials: true, // Allow cookies and credentials to be sent
};
app.use(cors(corsOptions));

// Enable cookie parsing with a secret for signed cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// Serve static assets from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Serve favicon for browser default request
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// Connect to MongoDB
connectDB();

// Define routes
// Health check route
app.get("/", (req, res) => res.send("Sufiza Server Running"));

// Location-related API routes
app.use("/api/locations", locationRoutes);

// Apartment-related API routes
app.use("/api/apartments", apartmentRoutes);

// Custom 404 handler for unknown routes
app.use(notFoundHandler);

// General error handler for handling server errors
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
