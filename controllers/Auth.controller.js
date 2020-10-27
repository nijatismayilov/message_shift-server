const createError = require("http-errors");
const User = require("../models/User.model");
const { authSchema, userSchema } = require("../helpers/validation_schema");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../helpers/jwt_helper");
const redisClient = require("../helpers/init_redis");

module.exports = {
	signUp: async (req, res, next) => {
		try {
			const result = await userSchema.validateAsync(req.body);

			const doesExist = await User.findOne({ email: result.email });

			if (doesExist) throw createError.Conflict(`A user already exists with ${result.email}`);

			const user = new User(result);
			const savedUser = await user.save();

			res.send({ email: savedUser.email });
		} catch (error) {
			if (error.isJoi) error.status = 422;
			next(error);
		}
	},

	signIn: async (req, res, next) => {
		try {
			const result = await authSchema.validateAsync(req.body);
			const user = await User.findOne({ email: result.email });

			if (!user)
				throw createError.NotFound("The email address you've entered doesn't match any account.");

			const isMatch = await user.isValidPassword(result.password);
			if (!isMatch)
				throw createError.Unauthorized(
					"The email and password you entered did not match with our records. Please double-check and try again"
				);

			const accessToken = await signAccessToken(user.id);
			const refreshToken = await signRefreshToken(user.id);

			res.send({ accessToken, refreshToken });
		} catch (error) {
			if (error.isJoi) return next(createError.BadRequest("Either email or password is invalid"));
			next(error);
		}
	},

	refreshToken: async (req, res, next) => {
		try {
			const { refreshToken } = req.body;
			if (!refreshToken) throw createError.BadRequest();

			const userId = await verifyRefreshToken(refreshToken);

			const newAccessToken = await signAccessToken(userId);
			const newRefreshToken = await signRefreshToken(userId);

			res.send({ accessToken: newAccessToken, refreshToken: newRefreshToken });
		} catch (error) {
			next(error);
		}
	},

	signOut: async (req, res, next) => {
		try {
			const { refreshToken } = req.body;

			if (!refreshToken) throw createError.BadRequest();

			const userId = await verifyRefreshToken(refreshToken);
			redisClient.DEL(userId, (err, val) => {
				if (err) {
					console.log(err);
					throw createError.InternalServerError();
				}

				console.log(val);
				res.sendStatus(204);
			});
		} catch (error) {
			next(error);
		}
	},
};
