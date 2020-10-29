const redis = require("redis");
const config = require("config");

const client = redis.createClient({
	port: 26119,
	host: config.get("redis-host"),
	password: config.get("redis-password"),
});

client.on("connect", () => console.log("Client connected to redis"));

client.on("error", (err) => console.log(err.message));

client.on("ready", () => console.log("Client is ready to use"));

client.on("end", () => console.log("Client disconnected from redis"));

process.on("SIGINT", () => client.quit());

module.exports = client;
