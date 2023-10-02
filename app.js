const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const busboy = require("connect-busboy");
const cors = require("cors");
require("dotenv/config");
const videoController = require("./controllers/video.controller");
const app = express();

// Connect to DB
require("./config/database");

// Check if uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
// Serve static files
app.use("/uploads", express.static(uploadsDir));

// Middlewares
app.use(cors());
app.use(busboy());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => res.send("HNGx Stage 5 task"));
app.post("/api/upload", videoController.uploadVideo);
app.get("/api/video/:id", videoController.getVideo);
app.get("/api/videos", videoController.getAllVideos);

// Export app
module.exports = app;
