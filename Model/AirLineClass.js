const ModelSchemaValidator = require("./ModelSchemaValidator");
const ModelSchema = require("./ModelSchema");
const sql = require("mssql");

const AirLineClassSchema = new ModelSchema(
  {
    id: new ModelSchemaValidator({
      name: "Id",
      sqlType: sql.Int,
    }),
    name: new ModelSchemaValidator({
      name: "Name",
      sqlType: sql.NVarChar,
    }),
    price: new ModelSchemaValidator({
      name: "Price",
      sqlType: sql.Float,
    }),
    createAt: new ModelSchemaValidator({
      name: "createAt",
      sqlType: sql.DateTime,
    }),
  },
  "HOTELS",
  "createAt"
);

module.exports = AirLineClassSchema;
