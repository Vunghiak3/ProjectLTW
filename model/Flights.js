const ModelSchemaValidator = require("./ModelSchemaValidator");
const ModelSchema = require("./ModelSchema");
const sql = require("mssql");

const FlightSchema = new ModelSchema(
  {
    id: new ModelSchemaValidator({
      name: "id",
      sqlType: sql.Int,
    }),
    name: new ModelSchemaValidator({
      name: "name",
      sqlType: sql.VarChar,
    }),
    fromLocation: new ModelSchemaValidator({
      name: "fromLocation",
      sqlType: sql.VarChar,
    }),
    toLocation: new ModelSchemaValidator({
      name: "toLocation",
      sqlType: sql.VarChar,
    }),
    dateOfDepartment: new ModelSchemaValidator({
      name: "dateOfDepartment",
      sqlType: sql.DateTime,
    }),
    emptySeat: new ModelSchemaValidator({
      name: "emptySeat",
      sqlType: sql.Int,
    }),
    airportID: new ModelSchemaValidator({
      name: "airportID",
      sqlType: sql.Int,
    }),
    createAt: new ModelSchemaValidator({
      name: "createAt",
      sqlType: sql.DateTime,
    }),
  },
  "FLIGHTS",
  "CreateAt"
);
module.exports = FlightSchema;
