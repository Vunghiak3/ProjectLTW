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

const flightRouter = require("./routers/Flight");
app.use("/api/v1/flight", flightRouter);

const hotelRouter = require("./routers/hotel");
const roomRouter = require("./routers/room");
const userRouter = require("./routers/user");

app.use("/api/v1/hotels", hotelRouter);
app.use("/api/v1/rooms", roomRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
