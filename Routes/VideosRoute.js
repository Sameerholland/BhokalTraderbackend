const express = require("express");
const { GetClasses, addClasses } = require("../Controller/VideosControllers");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Storage Configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/videos"); // Save to 'videos' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

// File upload validation middleware
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["video/mp4", "video/mkv", "video/avi"]; // Allowed video formats
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Invalid file type. Only MP4, MKV, and AVI are allowed."), false); // Reject file
  }
};

// Maximum file size (10MB in this case)
const upload = multer({
  storage,
  fileFilter,
});

const router = express.Router();

// Routes
router
  .post("/classes", GetClasses) // Get all classes
  .post("/add-class", upload.single("file"), addClasses); // Add a new class with a file upload

// Export Router
exports.router  = router;
