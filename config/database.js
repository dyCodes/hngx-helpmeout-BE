// /config/database.js
const mongoose = require("mongoose");
require("dotenv/config");

// Connect to DB
mongoose.connect(process.env.MONGODB_CONNECTION, { useNewUrlParser: true });
mongoose.connection.on("connected", () => console.log("Connected to database"));
mongoose.connection.on("error", (err) => console.error(err));

// Export mongoose
module.exports = mongoose;
