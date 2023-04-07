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
const seatRouter = require("./routers/seat");
const airPortRouter = require("./routers/airPort");
const flightBooking = require("./routers/flightBooking");

app.use("/api/v1/flight", flightRouter);
app.use("/api/v1/seat", seatRouter);
app.use("/api/v1/airports", airPortRouter);
app.use("/api/v1/flightBooking", flightBooking);

const hotelRouter = require("./routers/hotel");
const roomRouter = require("./routers/room");
const userRouter = require("./routers/user");
const bookingroomRouter = require("./routers/bookingroom");

app.use("/api/v1/booking", bookingroomRouter);
app.use("/api/v1/rooms", roomRouter);
app.use("/api/v1/hotels", hotelRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
