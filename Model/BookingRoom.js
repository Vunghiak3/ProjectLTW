const sql = require("mssql");
const ModelSchema = require("./ModelSchema");
const ModelSchemaValidator = require("./ModelSchemaValidator");

const BookingRoomSchema = new ModelSchema(
  {
    id: new ModelSchemaValidator({
      name: "Id",
      sqlType: sql.Int,
    }),
    userid: new ModelSchemaValidator({
      name: "UserId",
      sqlType: sql.Int,
    }),
    hotelid: new ModelSchemaValidator({
      name: "HotelId",
      sqlType: sql.Int,
    }),
    roomid: new ModelSchemaValidator({
      name: "RoomId",
      sqlType: sql.Int,
      require: true,
    }),
    price: new ModelSchemaValidator({
      name: "Price",
      sqlType: sql.Float,
    }),
    createAt: new ModelSchemaValidator({
      name: "CreateAt",
      sqlType: sql.DateTime,
    }),
    checkindate: new ModelSchemaValidator({
      name: "CheckInDate",
      sqlType: sql.Date,
      require: true,
    }),
    numberday: new ModelSchemaValidator({
      name: "NumberDay",
      sqlType: sql.Int,
      require: true,
      validator: function (val) {
        return val > 0;
      },
    }),
    checkoutdate: new ModelSchemaValidator({
      name: "CheckOutDate",
      sqlType: sql.Date,
    }),
    status: new ModelSchemaValidator({
      name: "Status",
      sqlType: sql.NVarChar,
    }),
  },
  "BOOKINGROOMS",
  "createAt"
);

module.exports = BookingRoomSchema;
