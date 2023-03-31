const ModelSchema = require("./ModelSchema");
const ModelSchemaValidator = require("./ModelSchemaValidator");
const sql = require("mssql");

const RoomSchema = new ModelSchema(
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
    price: new ModelSchemaValidator({
      name: "Price",
      sqlType: sql.Float,
      require: true,
    }),
    hotelid: new ModelSchemaValidator({
      name: "HotelId",
      sqlType: sql.Int,
      require: true,
    }),
    status: new ModelSchemaValidator({
      name: "Status",
      sqlType: sql.Char,
      require: true,
    }),
    createAt: new ModelSchemaValidator({
      name: "CreateAt",
      sqlType: sql.DateTime,
      require: true,
    }),
  },
  "ROOMS",
  "createAt"
);

module.exports = RoomSchema;
