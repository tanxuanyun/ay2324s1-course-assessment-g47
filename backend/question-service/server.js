require("dotenv").config(); //Load env variables

const express = require("express");
const mongoose = require("mongoose");
const questionRoutes = require("./routes/questions");

const app = express();

//middleware
app.use(express.json()); //Allows us to use json in the body of the request
app.use((req, res, next) => {
	console.log(req.path, req.method);
	next();
});

//routes
app.use("/api/questions", questionRoutes);

// Connect to mongodb
const connectWithRetry = () => {
	mongoose
		.connect(process.env.MONGO_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverSelectionTimeoutMS: 5000, // Timeout in milliseconds for server selection
		})
		.then(() => {
			console.log("Connected to MongoDB");
			// Only start the application server once the database connection is established
			app.listen(process.env.PORT, () => {
				console.log("Listening on port", process.env.PORT);
			});
		})
		.catch((error) => {
			console.log("MongoDB connection error:", error);
			// Retry the connection after a delay (e.g., 5 seconds)
			setTimeout(connectWithRetry, 5000);
		});
};
connectWithRetry();

module.exports = app;