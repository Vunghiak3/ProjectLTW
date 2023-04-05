const ModelSchemaValidator = require("./ModelSchemaValidator");
const ModelSchema = require("./ModelSchema");
const sql = require("mssql");

const FlightSchema = new ModelSchema(
  {
    id: new ModelSchemaValidator({
      name: "id",
      sqlType: sql.Int,
    }),
    UserId: new ModelSchemaValidator({
      name: "UserId",
      sqlType: sql.Int,
    }),
    AirportId: new ModelSchemaValidator({
      name: "AirportId",
      sqlType: sql.Int,
    }),
    FlightId: new ModelSchemaValidator({
      name: "FlightId",
      sqlType: sql.Int,
    }),
    SeatId: new ModelSchemaValidator({
      name: "SeatId",
      sqlType: sql.Int,
    }),
    PRICE: new ModelSchemaValidator({
      name: "PRICE",
      sqlType: sql.Float,
    }),
    createAt: new ModelSchemaValidator({
      name: "createAt",
      sqlType: sql.DateTime,
      require: true,
    }),
  },
  "AIRPORT",
  "CreateAt"
);
module.exports = AirPortSchema;
