const ModelSchemaValidator = require("./ModelSchemaValidator");
const ModelSchema = require("./ModelSchema");
const sql = require("mssql");

const SeatSchema = new ModelSchema(
  {
    id: new ModelSchemaValidator({
      name: "id",
      sqlType: sql.Int,
    }),
    name: new ModelSchemaValidator({
      name: "name",
      sqlType: sql.VarChar,
    }),
    AirlineClassId: new ModelSchemaValidator({
      name: "AirlineClassId",
      sqlType: sql.Int,
    }),
    Status: new ModelSchemaValidator({
      name: "Status",
      sqlType: sql.Char,
    }),
    FlightId: new ModelSchemaValidator({
      name: "FlightId",
      sqlType: sql.Int,
    }),
    AirportId: new ModelSchemaValidator({
      name: "AirportId",
      sqlType: sql.Int,
    }),
    CreateAt: new ModelSchemaValidator({
      name: "CreateAt",
      sqlType: sql.DATETIME,
    }),
  },
  "SEATS",
  "CreateAt"
);
module.exports = SeatSchema;
