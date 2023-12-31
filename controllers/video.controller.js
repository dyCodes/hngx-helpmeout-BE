const fs = require("fs");
const path = require("path");
const { Video } = require("../model/video.model");
const { Deepgram } = require("@deepgram/sdk");
require("dotenv/config");
const uploadsDir = path.join(__dirname, "..", "uploads");

// Get video by id
exports.getVideo = async (req, res, next) => {
	const id = req.params.id;
	// Find video by id
	const video = await Video.findById(id).catch((err) => console.error(err));
	if (!video) {
		return next(res.status(404).json({ error: "Video not found" }));
	}
	// Return video
	return next(res.status(200).json(video));
};

// Handle video upload
exports.uploadVideo = (req, res) => {
	if (req.busboy) {
		req.pipe(req.busboy); // Pipe it trough busboy

		req.busboy.on("file", (fieldName, file, { filename, encoding, mimeType }) => {
			console.log("uploading file:", fieldName, filename, encoding, mimeType);

			// Check file type
			if (!mimeType.startsWith("video")) {
				return res.status(400).json({ error: "Invalid file type! Expected video" });
			}

			// Generate filename
			const extension = filename.split(".").pop();
			filename = `video_${Date.now()}.${extension}`;
			// Create a writable stream to save the uploaded file
			const writeStream = fs.createWriteStream(path.join(uploadsDir, filename));

			// Pipe the file to the write stream
			file.pipe(writeStream);

			// On finish of the upload
			writeStream.on("finish", async () => {
				const videoURL = `${req.protocol}://${req.get("host")}/uploads/${filename}`;
				console.log("Video saved successfully", videoURL);
				// Save video to database
				const newVideo = new Video({
					name: filename,
					url: videoURL,
					transcript: "",
				});
				const video = await newVideo.save().catch((err) => console.error(err));
				if (video) {
					return res.status(200).json({ message: "Video uploaded successfully", video });
				} else {
					return res.status(500).json({ error: "Error saving video to database" });
				}
			});

			writeStream.on("error", (err) => {
				console.error(err);
				return res.status(500).json({ error: "Error uploading video" });
			});
		});
	} else {
		res.status(400).json({ error: "Invalid request! No file uploaded" });
	}
};

exports.transcribeVideo = async (req, res, next) => {
	const id = req.params.id;
	const video = await Video.findById(id).catch((err) => console.error(err));
	if (video) {
		// Check if video has been transcribed
		if (video.transcript) {
			return res.status(200).json({
				message: "Video transcription successful",
				transcript: video.transcript,
			});
		} else {
			// Transcribe video
			const transcript = await transcribeVideoFile(path.join(uploadsDir, video.name));
			// Update video transcript in database
			video.transcript = transcript;
			await video.save().catch((err) => console.error(err));
			return res.status(200).json({ message: "Video transcription successful", transcript });
		}
	} else {
		return res.status(404).json({ error: "Video not found" });
	}
};

// Get all videos
exports.getAllVideos = async (req, res, next) => {
	const videos = await Video.find();
	if (videos.length > 0) {
		return next(res.status(200).json(videos));
	} else return next(res.status(404).json({ error: "No videos found" }));
};

// Delete video
exports.deleteVideo = async (req, res, next) => {
	const id = req.params.id;
	const video = await Video.findById(id).catch((err) => console.error(err));
	if (video) {
		// Delete video from database
		await Video.deleteOne({ _id: id }).catch((err) => console.error(err));
		// Delete video from disk
		const uploadsDir = path.join(__dirname, "..", "uploads");
		fs.unlinkSync(path.join(uploadsDir, video.name));
		return next(res.status(200).json({ message: "Video deleted successfully" }));
	} else {
		return next(res.status(404).json({ error: "Video not found" }));
	}
};

/* Helper functions */
const transcribeVideoFile = async (videoPath) => {
	const mimeType = `video/${videoPath.split(".").pop()}`;
	// Transcribe video using Deepgram
	const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY);
	const response = await deepgram.transcription.preRecorded({
		stream: fs.createReadStream(videoPath),
		mimetype: mimeType,
	});
	return response.results.channels[0].alternatives[0].transcript;
};
