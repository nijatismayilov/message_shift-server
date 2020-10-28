const jwt = require("jsonwebtoken");
const config = require("config");
const createError = require("http-errors");
const redisClient = require("../helpers/init_redis");

module.exports = {
	signAccessToken: (userId) => {
		return new Promise((resolve, reject) => {
			const payload = {};
			const secret = config.get("jwt-access-token-secret");
			const options = {
				expiresIn: "1h",
				issuer: "message-shift.com",
				audience: userId,
			};

			jwt.sign(payload, secret, options, (err, token) => {
				if (err) {
					console.log(err.message);
					return reject(createError.InternalServerError());
				}
				resolve(token);
			});
		});
	},
	verifyAccessToken: (req, res, next) => {
		const authHeader = req.header("authorization");

		if (!authHeader) return next(createError.Unauthorized());

		const bearerToken = authHeader.split(" ");
		const token = bearerToken[1];

		jwt.verify(token, config.get("jwt-access-token-secret"), (err, payload) => {
			if (err) {
				const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
				return next(createError.Unauthorized(message));
			}

			req.payload = payload;
			next();
		});
	},
	signRefreshToken: (userId) => {
		return new Promise((resolve, reject) => {
			const payload = {};
			const secret = config.get("jwt-refresh-token-secret");
			const options = {
				expiresIn: "1y",
				issuer: "message-shift.com",
				audience: userId,
			};

			jwt.sign(payload, secret, options, (err, token) => {
				if (err) {
					console.log(err.message);
					return reject(createError.InternalServerError());
				}

				redisClient.SET(userId, token, "EX", 365 * 24 * 60 * 60, (err, reply) => {
					if (err) {
						console.log(err);
						return reject(createError.InternalServerError());
					}

					resolve(token);
				});
			});
		});
	},
	verifyRefreshToken: (refreshToken) => {
		return new Promise((resolve, reject) => {
			const secret = config.get("jwt-refresh-token-secret");
			jwt.verify(refreshToken, secret, (err, payload) => {
				if (err) return reject(createError.Unauthorized());

				const userId = payload.aud;

				redisClient.GET(userId, (err, result) => {
					if (err) {
						console.log(err.message);
						return reject(createError.InternalServerError());
					}

					if (refreshToken === result) {
						return resolve(userId);
					}
					return reject(createError.Unauthorized());
				});
			});
		});
	},
};
