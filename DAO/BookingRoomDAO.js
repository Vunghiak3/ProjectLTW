const dbConfig = require("./../database/dbconfig");
const dbUtils = require("./../utils/dbUtils");
const StaticData = require("./../utils/StaticData");
const BookingRoomSchema = require("./../Model/BookingRoom");
const RoomDAO = require("./RoomDAO");
const HotelDAO = require("./HotelDAO");

exports.getAllBookRoom = async (filter) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let query = `SELECT * FROM ${BookingRoomSchema.schemaName}`;
  let countQuery = `SELECT COUNT(DISTINCT ${BookingRoomSchema.schema.id.name}) AS totalItem FROM ${BookingRoomSchema.schemaName}`;

  const page = filter.page * 1 || 1;
  let pageSize = filter.pageSize * 1 || StaticData.config.MAX_PAGE_SIZE;
  if (pageSize > StaticData.config.MAX_PAGE_SIZE) {
    pageSize = StaticData.config.MAX_PAGE_SIZE;
  }

  const { filterStr, paginationStr } = dbUtils.getFilterQuery(
    BookingRoomSchema.schema,
    filter,
    page,
    pageSize,
    BookingRoomSchema.defaultSort
  );
  if (filterStr) {
    query += " " + filterStr;
    countQuery += " " + filterStr;
  }
  if (paginationStr) {
    query += " " + paginationStr;
  }
  let result = await dbConfig.db.pool.request().query(query);
  let countResult = await dbConfig.db.pool.request().query(countQuery);
  let totalItem = 0;
  if (countResult.recordsets[0].length > 0) {
    totalItem = countResult.recordsets[0][0].totalItem;
  }
  let totalPage = Math.ceil(totalItem / pageSize);
  let bookingrooms = result.recordsets[0];
  return {
    page,
    pageSize,
    totalPage,
    totalItem,
    bookingrooms: bookingrooms,
  };
};

exports.getBookingRoomByCreateAt = async (createat) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      BookingRoomSchema.schema.createAt.name,
      BookingRoomSchema.schema.createAt.sqlType,
      createat
    )
    .query(
      `SELECT * FROM ${BookingRoomSchema.schemaName} WHERE ${BookingRoomSchema.schema.createAt.name} = @${BookingRoomSchema.schema.createAt.name}`
    );
  return result.recordsets[0][0];
};

exports.deleteBookRoom = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      BookingRoomSchema.schema.id.name,
      BookingRoomSchema.schema.id.sqlType,
      id
    )
    .query(
      `DELETE ${BookingRoomSchema.schemaName} WHERE ${BookingRoomSchema.schema.id.name} = @${BookingRoomSchema.schema.id.name}`
    );
  return result.recordsets;
};

exports.updateBookRoom = async (id, updateInfo) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!updateInfo) {
    throw new Error("Invalid input param!");
  }
  let query = `UPDATE ${BookingRoomSchema.schemaName} SET`;
  const { request, updateStr } = dbUtils.getUpdateQuery(
    BookingRoomSchema.schema,
    dbConfig.db.pool.request(),
    updateInfo
  );
  if (!updateStr) {
    throw new Error("Invalid update param!");
  }
  request.input(
    BookingRoomSchema.schema.id.name,
    BookingRoomSchema.schema.id.sqlType,
    id
  );
  query +=
    " " +
    updateStr +
    ` WHERE ${BookingRoomSchema.schema.id.name} = @${BookingRoomSchema.schema.id.name}`;
  let result = await request.query(query);
  return result.recordsets;
};

exports.getBookRoomById = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      BookingRoomSchema.schema.id.name,
      BookingRoomSchema.schema.id.sqlType,
      id
    )
    .query(
      `SELECT * FROM ${BookingRoomSchema.schemaName} WHERE ${BookingRoomSchema.schema.id.name} = @${BookingRoomSchema.schema.id.name}`
    );
  return result.recordsets[0][0];
};

async function totalPriceRoom(id, numberday) {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (numberday <= 0) {
    throw new Error("Invalid numberday!");
  }
  let room = await RoomDAO.getRoomById(id);
  let price = room.Price * numberday;
  return price;
}

exports.createBookroom = async (info) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!info) {
    throw new Error("Invalid input params!");
  }

  let now = new Date();
  info.createAt = now.toISOString();
  info.status = "pending";
  info.price = await totalPriceRoom(info.roomid, info.numberday);
  const hotel = await HotelDAO.getHotelByIdRoom(info.roomid);
  info.hotelid = hotel.Id;
  let insertData = BookingRoomSchema.validateData(info);
  let query = `INSERT INTO ${BookingRoomSchema.schemaName}`;
  const { request, insertFieldNamesStr, insertValuesStr } =
    dbUtils.getInsertQuery(
      BookingRoomSchema.schema,
      dbConfig.db.pool.request(),
      insertData
    );
  query += " (" + insertFieldNamesStr + ") VALUES (" + insertValuesStr + ")";
  let result = await request.query(query);
  return result.recordsets;
};
