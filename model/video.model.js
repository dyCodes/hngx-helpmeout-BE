const mongoose = require("mongoose");

const videoSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	url: {
		type: String,
		required: true,
	},
	transcript: {
		type: String,
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
});

exports.Video = mongoose.model("video", videoSchema);
