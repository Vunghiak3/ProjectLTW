const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(morgan("dev"));

app.use((req, res, next) => {
  const date = new Date().toISOString();
  req.requestTime = date;
  next();
});

app.use(express.json());

const hotelRouter = require("./routers/hotel");
const roomRouter = require("./routers/room");

app.use("/api/v1/hotels", hotelRouter);
app.use("/api/v1/rooms", roomRouter);

module.exports = app;
