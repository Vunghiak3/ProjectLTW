const ModelSchemaValidator = require("./ModelSchemaValidator");
const ModelSchema = require("./ModelSchema");
const sql = require("mssql");

const HotelSchema = new ModelSchema(
  {
    id: new ModelSchemaValidator({
      name: "Id",
      sqlType: sql.Int,
    }),
    name: new ModelSchemaValidator({
      name: "Name",
      sqlType: sql.NVarChar,
      require: true,
    }),
    phonenumber: new ModelSchemaValidator({
      name: "PhoneNumber",
      sqlType: sql.NVarChar,
      require: true,
    }),
    email: new ModelSchemaValidator({
      name: "Email",
      sqlType: sql.VarChar,
      require: true,
    }),
    address: new ModelSchemaValidator({
      name: "Address",
      sqlType: sql.NVarChar,
      require: true,
    }),
    city: new ModelSchemaValidator({
      name: "City",
      sqlType: sql.NVarChar,
      require: true,
    }),
    emtyrooms: new ModelSchemaValidator({
      name: "EmtyRooms",
      sqlType: sql.Int,
    }),
    createAt: new ModelSchemaValidator({
      name: "createAt",
      sqlType: sql.DateTime,
    }),
  },
  "HOTELS",
  "createAt"
);

module.exports = HotelSchema;
