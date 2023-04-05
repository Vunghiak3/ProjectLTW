const ModelSchemaValidator = require("./ModelSchemaValidator");
const ModelSchema = require("./ModelSchema");
const sql = require("mssql");

const AirPortSchema = new ModelSchema(
  {
    id: new ModelSchemaValidator({
      name: "id",
      sqlType: sql.Int,
    }),
    name: new ModelSchemaValidator({
      name: "name",
      sqlType: sql.VarChar,
    }),
    address: new ModelSchemaValidator({
      name: "address",
      sqlType: sql.VarChar,
    }),
    phoneNumber: new ModelSchemaValidator({
      name: "phoneNumber",
      sqlType: sql.VarChar,
    }),
    createAt: new ModelSchemaValidator({
      name: "createAt",
      sqlType: sql.DateTime,
      require: true,
    }),
  },
  "AIRPORTS",
  "createAt"
);
module.exports = AirPortSchema;
