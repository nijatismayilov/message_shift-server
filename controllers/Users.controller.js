const createError = require("http-errors");
const User = require("../models/User.model");

module.exports = {
	loadDetails: async (req, res, next) => {
		try {
			const userId = req.payload.aud;
			const user = await User.findById(userId).select("-password");
			res.json({ user });
		} catch (error) {
			next(error);
		}
	},
};
