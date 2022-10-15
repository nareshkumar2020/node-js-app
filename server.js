const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors');
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');
const connectDB = require("./config/dbConn");
require('dotenv').config();

const PORT = process.env.PORT || 3500;

// connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);


app.use(cors(corsOptions));

// built in middle ware for form data to acccessed as params
app.use(express.urlencoded({ extended: false }));

// built in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// built in middleware for static files
app.use(express.static(path.join(__dirname, '/public')));

app.get("/", (req, res) => {
	res.send("hello world!");
});

// routes
app.use('/register', require('./routes/api/register'));
app.use('/auth', require('./routes/api/auth'));
app.use('/refresh', require('./routes/api/refresh'));
app.use('/logout', require('./routes/api/logout'));

app.use(verifyJWT);
app.use('/appointments', require('./routes/api/appointments'));



app.all("*", (req, res) => {
	res.status(404);
	if (req.accepts('html')) {
		res.sendFile(path.join(__dirname, 'views', '404.html'));
	} else if (req.accepts('json')) {
		res.json({ error: "404  not found" })
	} else {
		res.type('txt').send("404  not found")
	}
})

app.use(errorHandler);

mongoose.connection.once('open', () => {
	console.log('Connected to MongoDB');
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})

