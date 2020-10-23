const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");
const RequestIp = require("@supercharge/request-ip");

const expressIpMiddleware = (req, res, next) => {
	req.ip = RequestIp.getClientIp(req);

	next();
};

const app = express();

// app.use(expressIpMiddleware());
app.use(cors());
app.use(express.json());

const db = config.get("mongoURI");

mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
	.then(() => console.log("MongoDB Connected"))
	.catch((err) => console.log(err));

app.use("/api/Users", require("./routes/api/users"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on the port ${PORT}`));
