const dbConfig = require("./../database/dbconfig");
const dbUtils = require("./../utils/dbUtils");
const StaticData = require("./../utils/StaticData");
const BookingRoomSchema = require("./../Model/BookingRoom");
const RoomSchema = require("./../Model/Room");
const HotelSchema = require("./../Model/Hotel");

exports.getAllBookingRoom = async (filter) => {
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

exports.createBookRoom = async (newBookRoom) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!newBookRoom) {
    throw new Error("Invalid input param!");
  }
  let now = new Date();
  newBookRoom.createAt = now.toISOString();
  newBookRoom.status = "confirmed";
  let insertData = BookingRoomSchema.validateData(newBookRoom);
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
