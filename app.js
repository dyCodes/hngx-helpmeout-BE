const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { getAllVideos, getVideo, saveVideo } = require("./controllers/video.controller");
require("dotenv/config");

// Connect to DB
mongoose.connect(process.env.MONGODB_CONNECTION, { useNewUrlParser: true });
mongoose.connection.on("connected", () => console.log("Connected to database"));
mongoose.connection.on("error", (err) => console.error(err));

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => res.send("HNGx Stage 5 task [dyCodes]"));
app.post("/api/upload", saveVideo);
app.get("/api/video/:id", getVideo);
app.get("/api/videos", getAllVideos);

// Export app
module.exports = app;
