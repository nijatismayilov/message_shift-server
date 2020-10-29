const Joi = require("@hapi/joi");

const userSchema = Joi.object({
	name: Joi.string().required(),
	surname: Joi.string().required(),
	email: Joi.string().email().lowercase().required(),
	password: Joi.string().min(6).required(),
});

const authSchema = Joi.object({
	email: Joi.string().email().lowercase().required(),
	password: Joi.string().min(6).required(),
});

module.exports = { authSchema, userSchema };
