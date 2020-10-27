const mongoose = require("mongoose");
const config = require("config");

const db = config.get("mongo-URI");

mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
	.then(() => console.log("MongoDB Connected"))
	.catch((err) => console.log(err.message));

mongoose.connection.on("connected", () => console.log("Mongoose connected to DB"));

mongoose.connection.on("error", (error) => console.log(error.message));

mongoose.connection.on("disconnected", () => console.log("Mongoose connection diconnected"));

process.on("SIGINT", async () => {
	await mongoose.connection.close();
	process.exit(0);
});
