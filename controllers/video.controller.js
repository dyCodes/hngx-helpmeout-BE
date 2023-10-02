const { Video } = require("../model/video.model");

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

exports.saveVideo = async (req, res, next) => {
	const request = req.body;
	if (!request) return next(res.json({ error: "Video data is required" }));

	// Save video to database
	const newVideo = new Video({
		name: request.name,
		url: request.url,
		transcript: request.transcript,
	});
	const video = await newVideo.save().catch((err) => console.error(err));
	if (video) {
		return next(res.status(200).json(video));
	} else return next(res.status(500).json({ error: "Error saving video" }));
};

exports.getAllVideos = async (req, res, next) => {
	const videos = await Video.find();
	if (videos.length > 0) {
		return next(res.status(200).json(videos));
	} else return next(res.status(404).json({ error: "No videos found" }));
};
