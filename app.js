const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
const cors = require("cors");

const app = express();

require("./helpers/init_mongodb");
require("./helpers/init_redis");

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/Auth.route"));
app.use("/api/Users", require("./routes/users"));

app.use(async (req, res, next) => {
	next(createError.NotFound());
});

app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.send({
		error: {
			status: err.status || 500,
			message: err.message,
		},
	});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on the port ${PORT}`));
