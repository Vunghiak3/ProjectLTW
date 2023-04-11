const ModelSchemaValidator = require("./ModelSchemaValidator");
const ModelSchema = require("./ModelSchema");
const sql = require("mssql");

const FlightBookingSchema = new ModelSchema(
  {
    id: new ModelSchemaValidator({
      name: "id",
      sqlType: sql.Int,
    }),
    UserId: new ModelSchemaValidator({
      name: "UserId",
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
    Status: new ModelSchemaValidator({
      name: "Status",
      sqlType: sql.VarChar,
    }),
    createAt: new ModelSchemaValidator({
      name: "createAt",
      sqlType: sql.DateTime,
      require: true,
    }),
  },
  "BOOKINGFLIGHTS",
  "CreateAt"
);
module.exports = FlightBookingSchema;
