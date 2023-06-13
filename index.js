const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const api = require("./api");

dotenv.config();

// Allows cross origin requests
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
// Middleware
app.use(cookieParser());
app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Routes
app.use("/api", api);

app.get("/", (req, res) => {
  res.send("Food API");
});

// Error handling
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = app;
