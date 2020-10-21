const express = require("express");
const bcyrpt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

const auth = require("../../middlewares/auth");

const router = express.Router();

const User = require("../../models/User");

router.post("/SignIn", async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) res.status(400).json({ message: "Required fields cannot be empty" });

	try {
		const user = await User.findOne({ email });
		if (!user) res.status(404).json({ message: "User does not exist" });

		try {
			const isMatch = await bcyrpt.compare(password, user.password);

			if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

			jwt.sign({ id: user.id }, config.get("jwtSecret"), { expiresIn: 604800 }, (err, token) => {
				if (err) throw err;

				res.json({
					token,
					user: {
						id: user.id,
						name: user.name,
						email: user.email,
					},
				});
			});
		} catch (err) {
			console.log(err);
		}
	} catch (err) {
		console.log(err);
	}
});

router.post("/SignUp", async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password)
		return res.status(400).json({ message: "Required fields cannot be empty" });

	try {
		const user = await User.findOne({ email });
		if (user) return res.status(400).json({ message: "A user already exists with this email" });

		const newUser = new User({
			name,
			email,
			password,
		});

		bcyrpt.genSalt(10, (err, salt) => {
			bcyrpt.hash(newUser.password, salt, async (err, hash) => {
				if (err) throw err;

				newUser.password = hash;
				try {
					const user = await newUser.save();

					jwt.sign(
						{ id: user.id },
						config.get("jwtSecret"),
						{ expiresIn: 604800 },
						(err, token) => {
							if (err) throw err;

							res.json(token);
						}
					);
				} catch (err) {
					console.log(`err: ${err}`);
				}
			});
		});
	} catch (err) {
		console.log(err);
	}
});

router.get("/LoadDetails", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		res.json(user);
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
