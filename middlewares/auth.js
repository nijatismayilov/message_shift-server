const config = require("config");
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
	const bearerHeader = req.header("authorization");

	if (typeof bearerHeader === "undefined")
		return res.status(401).json({ message: "You are not authorized" });

	const token = bearerHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, config.get("jwtSecret"));
		req.user = decoded;
		next();
	} catch (err) {
		res.status(400).json({ message: "Token is not valid" });
	}
};

module.exports = auth;
