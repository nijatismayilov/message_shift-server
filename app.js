const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const db = require("./config/keys").mongoURI;

mongoose
	.connect(db)
	.then(() => console.log("MongoDB Connected"))
	.catch((err) => console.log(err));

app.use("/api/users", require("./routes/api/users"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on the port ${PORT}`));
