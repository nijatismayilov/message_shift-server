const express = require("express");
const router = express.Router();

const User = require("../../models/User");

router.get("/", async (req, res) => {
	try {
		const users = await User.find().sort({ date: -1 });
		res.json(users);
	} catch (err) {
		console.log(err);
	}
});

router.post("/", async (req, res) => {
	const newUser = new User({
		name: req.body.name,
	});

	try {
		const user = await newUser.save();
		res.json(user);
	} catch (err) {
		console.log(err);
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		await user.remove();
		res.json({ message: "User delete succesfully" });
	} catch (err) {
		res.status(404).json({ message: "User does not exist" });
	}
});

module.exports = router;
