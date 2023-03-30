const HotelSchema = require("../Model/Hotel");
const dbConfig = require("./../database/dbconfig");
const dbUtils = require("./../utils/dbUtils");
const StaticData = require("./../utils/StaticData");
const RoomsDAO = require("./RoomDAO");

async function setHotelInfor(hotel) {
  const rooms = await RoomsDAO.getRoomByHotelId(hotel.Id);
  hotel.Rooms = rooms;
  return hotel;
}

exports.getAllHotel = async (filter) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let query = `SELECT * FROM ${HotelSchema.schemaName}`;
  let result = await dbConfig.db.pool.request().query(query);
  let hotels = result.recordsets[0];

  let countQuery = `SELECT COUNT(DISTINCT ${HotelSchema.schema.id.name}) AS totalItem FROM ${HotelSchema.schemaName}`;
  const page = filter.page * 1 || 1;
  let pageSize = filter.pageSize * 1 || StaticData.config.MAX_PAGE_SIZE;
  if (pageSize > StaticData.config.MAX_PAGE_SIZE) {
    pageSize = StaticData.config.MAX_PAGE_SIZE;
  }
  const { filterStr, paginationStr } = dbUtils.getFilterQuery(
    HotelSchema.schema,
    filter,
    page,
    pageSize,
    HotelSchema.defaultSort
  );

  if (filterStr) {
    query += " " + filterStr;
    countQuery += " " + filterStr;
  }
  if (paginationStr) {
    query += " " + paginationStr;
  }
  const countResult = await dbConfig.db.pool.request().query(countQuery);
  let totalItem = 0;
  if (countResult.recordsets[0].length > 0) {
    totalItem = countResult.recordsets[0][0].totalItem;
  }
  let totalPage = Math.ceil(totalItem / pageSize);

  for (let i = 0; i < hotels.length; i++) {
    const hotel = hotels[i];
    await setHotelInfor(hotel);
  }
  return {
    page,
    pageSize,
    totalPage,
    totalItem,
    hotels: hotels,
  };
};

exports.createNewHotel = async (hotel) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!hotel) {
    throw new Error("Invalid input param!");
  }
  let now = new Date();
  hotel.createAt = now.toISOString();
  hotel.emtyrooms = 0;
  let insertData = HotelSchema.validateData(hotel);
  let query = `INSERT INTO ${HotelSchema.schemaName}`;
  const { request, insertFieldNamesStr, insertValuesStr } =
    dbUtils.getInsertQuery(
      HotelSchema.schema,
      dbConfig.db.pool.request(),
      insertData
    );
  query += " (" + insertFieldNamesStr + ") VALUES (" + insertValuesStr + ")";
  let result = await request.query(query);
  return result.recordsets;
};

exports.getHotelByname = async (Name) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  const request = dbConfig.db.pool.request();
  let result = await request
    .input(HotelSchema.schema.name.name, HotelSchema.schema.name.sqlType, Name)
    .query(
      `SELECT * FROM ${HotelSchema.schemaName} WHERE ${HotelSchema.schema.name.name} = @${HotelSchema.schema.name.name}`
    );
  return result.recordsets[0][0];
};

exports.getHotelById = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(HotelSchema.schema.id.name, HotelSchema.schema.id.sqlType, id)
    .query(
      `SELECT * FROM ${HotelSchema.schemaName} WHERE ${HotelSchema.schema.id.name} = @${HotelSchema.schema.id.name}`
    );
  let hotel = result.recordsets[0][0];
  return hotel;
};

exports.deleteHotelById = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  const result = await request
    .input(HotelSchema.schema.id.name, HotelSchema.schema.id.sqlType, id)
    .query(
      `DELETE ${HotelSchema.schemaName} WHERE ${HotelSchema.schema.id.name} = @${HotelSchema.schema.id.name}`
    );
  return result.recordsets;
};

exports.updateHotelById = async (id, updateInfo) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!updateInfo) {
    throw new Error("Invalid input param!");
  }
  let query = `UPDATE ${HotelSchema.schemaName} SET`;
  const { request, updateStr } = dbUtils.getUpdateQuery(
    HotelSchema.schema,
    dbConfig.db.pool.request(),
    updateInfo
  );
  if (!updateStr) {
    throw new Error("Invalid update param!");
  }
  request.input(HotelSchema.schema.id.name, HotelSchema.schema.id.sqlType, id);
  query +=
    " " +
    updateStr +
    ` WHERE ${HotelSchema.schema.id.name} = @${HotelSchema.schema.id.name}`;
  let result = await request.query(query);
  return result.recordsets;
};

exports.getHotelByCreateAt = async (date) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  const request = dbConfig.db.pool.request();
  let result = await request
    .input(
      HotelSchema.schema.createAt.name,
      HotelSchema.schema.createAt.sqlType,
      date
    )
    .query(
      `select * from ${HotelSchema.schemaName} where ${HotelSchema.schema.createAt.name} = @${HotelSchema.schema.createAt.name}`
    );
  return result.recordsets[0][0];
};
