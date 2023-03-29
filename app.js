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

const fs = require("fs");
const data = fs.readFileSync(`${__dirname}/dev-data/data/users.json`, "utf-8");
const dataArr = JSON.parse(data);
app.post("/", (req, res) => {
  let result = {
    code: 200,
    msg: "OK",
    data: {
      tours: dataArr,
    },
  };

  res.status(200).json(result);
});

module.exports = app;
