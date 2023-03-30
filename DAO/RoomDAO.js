const RoomSchema = require("./../Model/Room");
const dbConfig = require("./../database/dbconfig");
const StaticData = require("./../utils/StaticData");
const dbUtils = require("./../utils/dbUtils");
const HotelSchema = require("./../Model/Hotel");

exports.getAllRooms = async (filter) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let query = `SELECT * FROM ${RoomSchema.schemaName}`;
  let result = await dbConfig.db.pool.request().query(query);
  const rooms = result.recordsets[0];

  let countQuery = `SELECT COUNT(DISTINCT ${RoomSchema.schema.id.name}) AS totalItem FROM ${RoomSchema.schemaName}`;
  const page = filter.page * 1 || 1;
  let pageSize = filter.pageSize * 1 || StaticData.config.MAX_PAGE_SIZE;
  if (pageSize > StaticData.config.MAX_PAGE_SIZE) {
    pageSize = StaticData.config.MAX_PAGE_SIZE;
  }
  const { filterStr, paginationStr } = dbUtils.getFilterQuery(
    RoomSchema.schema,
    filter,
    page,
    pageSize,
    RoomSchema.defaultSort
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

  return {
    page,
    pageSize,
    totalItem,
    totalPage,
    rooms: rooms,
  };
};

exports.getRoomById = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db1");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(RoomSchema.schema.id.name, RoomSchema.schema.id.sqlType, id)
    .query(
      `SELECT * FROM ${RoomSchema.schemaName} WHERE ${RoomSchema.schema.id.name} = @${RoomSchema.schema.id.name}`
    );
  let room = result.recordsets[0][0];
  return room;
};

exports.getRoomByHotelId = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db1");
  }
  let request = dbConfig.db.pool.request();
  let result = await request.query(
    `SELECT ${RoomSchema.schemaName}.${RoomSchema.schema.id.name}, ${RoomSchema.schemaName}.${RoomSchema.schema.name.name}, ${RoomSchema.schema.price.name}, ${RoomSchema.schema.hotelid.name}, ${RoomSchema.schema.createat.name}, ${RoomSchema.schema.status.name} FROM ${RoomSchema.schemaName}, ${HotelSchema.schemaName} WHERE ${RoomSchema.schemaName}.${RoomSchema.schema.hotelid.name} = ${HotelSchema.schemaName}.${HotelSchema.schema.id.name}`
  );
  return result.recordsets[0];
};

exports.deleteRoomByHotelId = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db1");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      RoomSchema.schema.hotelid.name,
      RoomSchema.schema.hotelid.sqlType,
      id
    )
    .query(
      `DELETE ${RoomSchema.schemaName} WHERE ${RoomSchema.schema.hotelid.name} = @${RoomSchema.schema.hotelid.name}`
    );
  return result.recordsets;
};

exports.createNewRoom = async (room) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!room) {
    throw new Error("Invalid input param!");
  }
  let request = dbConfig.db.pool.request();
  const result = await request
    .input(
      RoomSchema.schema.name.name,
      RoomSchema.schema.name.sqlType,
      room.name
    )
    .input(
      RoomSchema.schema.price.name,
      RoomSchema.schema.price.sqlType,
      room.price
    )
    .input(
      RoomSchema.schema.hotelid.name,
      RoomSchema.schema.hotelid.sqlType,
      room.hotelid
    )
    .input(
      RoomSchema.schema.status.name,
      RoomSchema.schema.status.sqlType,
      room.status
    )
    .query(
      `INSERT INTO ${RoomSchema.schemaName} (${RoomSchema.schema.name.name}, ${RoomSchema.schema.price.name}, ${RoomSchema.schema.hotelid.name}, ${RoomSchema.schema.status.name}) VALUES (@${RoomSchema.schema.name.name}, @${RoomSchema.schema.price.name}, @${RoomSchema.schema.hotelid.name}, @${RoomSchema.schema.status.name})`
    );
  return result.recordsets;
};

exports.getRoomByName = async (name) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  const request = dbConfig.db.pool.request();
  let result = await request
    .input(RoomSchema.schema.name.name, RoomSchema.schema.name.sqlType, name)
    .query(
      `SELECT * FROM ${RoomSchema.schemaName} WHERE ${RoomSchema.schema.name.name} = @${RoomSchema.schema.name.name}`
    );
  return result.recordsets[0][0];
};

exports.deleteRoomById = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  const request = dbConfig.db.pool.request();
  let result = request
    .input(RoomSchema.schema.id.name, RoomSchema.schema.id.sqlType, id)
    .query(
      `DELETE ${RoomSchema.schemaName} WHERE ${RoomSchema.schema.id.name} = @${RoomSchema.schema.id.name}`
    );
  return result.recordsets;
};

exports.updateRoomById = async (id, updateInfo) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!updateInfo) {
    throw new Error("Invalid input param!");
  }
  let query = `UPDATE ${RoomSchema.schemaName} SET`;
  const { request, updateStr } = dbUtils.getUpdateQuery(
    RoomSchema.schema,
    dbConfig.db.pool.request(),
    updateInfo
  );
  if (!updateStr) {
    throw new Error("Invalid update param");
  }
  request.input(RoomSchema.schema.id.name, RoomSchema.schema.id.sqlType, id);
  query +=
    " " +
    updateStr +
    ` WHERE ${RoomSchema.schema.id.name} = @${RoomSchema.schema.id.name}`;
  let result = await request.query(query);

  return result.recordsets;
};