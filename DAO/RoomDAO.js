const dbConfig = require("./../database/dbconfig");
const StaticData = require("./../utils/StaticData");
const dbUtils = require("./../utils/dbUtils");
const RoomSchema = require("./../Model/Room");
const HotelSchema = require("./../Model/Hotel");
const BookingRoomSchema = require("./../Model/BookingRoom");
const HotelDAO = require("./../DAO/HotelDAO");

async function setRoomInfo(room) {
  const hotel = await HotelDAO.getHotelById(room.HotelId);
  room.NameHotel = hotel.Name;
  room.Address = hotel.Address;
  room.City = hotel.City;
  return room;
}

exports.getAllRooms = async (filter) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let query = `SELECT * FROM ${RoomSchema.schemaName}`;
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
  let result = await dbConfig.db.pool.request().query(query);
  const countResult = await dbConfig.db.pool.request().query(countQuery);
  let totalItem = 0;
  if (countResult.recordsets[0].length > 0) {
    totalItem = countResult.recordsets[0][0].totalItem;
  }
  let totalPage = Math.ceil(totalItem / pageSize);
  const rooms = result.recordsets[0];

  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i];
    await setRoomInfo(room);
  }

  return {
    page,
    pageSize,
    totalItem,
    totalPage,
    rooms: rooms,
  };
};

exports.findRooms = async (info) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let query = `SELECT DISTINCT ${RoomSchema.schemaName}.*`;
  let from = `FROM ${RoomSchema.schemaName}`;
  let where = `WHERE ${RoomSchema.schemaName}.${RoomSchema.schema.status.name} = 'TRUE'`;

  if (info.city) {
    request.input(
      HotelSchema.schema.city.name,
      HotelSchema.schema.city.sqlType,
      info.city
    );
    query += `, ${HotelSchema.schemaName}.${HotelSchema.schema.name.name} AS NameHotel, ${HotelSchema.schema.city.name}, ${HotelSchema.schema.address.name}`;

    from += ` JOIN ${HotelSchema.schemaName} ON ${RoomSchema.schemaName}.${RoomSchema.schema.hotelid.name} = ${HotelSchema.schemaName}.${HotelSchema.schema.id.name}`;
    where += ` AND ${HotelSchema.schema.city.name} = @${HotelSchema.schema.city.name}`;
  }

  if (info.checkindate) {
    if (new Date(info.checkindate) < new Date()) {
      throw new Error("Invalid date!");
    }
    request.input(
      BookingRoomSchema.schema.checkindate.name,
      BookingRoomSchema.schema.checkindate.sqlType,
      info.checkindate
    );
    from += `, ${BookingRoomSchema.schemaName}`;
    where += ` AND ${BookingRoomSchema.schema.checkoutdate.name} < @${BookingRoomSchema.schema.checkindate.name}`;
  }

  if (info.numberday) {
    if (info.numberday <= 0) {
      throw new Error("Invalid numberday!");
    }
    request.input(
      BookingRoomSchema.schema.numberday.name,
      BookingRoomSchema.schema.numberday.sqlType,
      info.numberday
    );
    let checkindate = new Date(info.checkindate);
    checkindate = new Date(checkindate.setDate(checkindate.getDate() + 1));
    let checkoutdate = new Date(checkindate.getTime());
    checkoutdate = new Date(
      checkoutdate.setDate(checkoutdate.getDate() - 1 + info.numberday - 1)
    );
    console.log(
      "🚀 ~ file: RoomDAO.js:112 ~ exports.findRooms= ~ checkindate:",
      checkindate
    );
    console.log(
      "🚀 ~ file: RoomDAO.js:117 ~ exports.findRooms= ~ checkoutdate:",
      checkoutdate
    );
    where += ` AND '${checkoutdate.toLocaleDateString()}' < ${
      BookingRoomSchema.schema.checkindate.name
    } OR '${checkoutdate.toLocaleDateString()}' > ${
      BookingRoomSchema.schema.checkoutdate.name
    }`;
  }

  let queryStr = query + " " + from + " " + where;
  let result = await request.query(queryStr);

  return result.recordsets[0];
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
  let result = await request
    .input(HotelSchema.schema.id.name, HotelSchema.schema.id.sqlType, id)
    .query(
      `SELECT DISTINCT ${RoomSchema.schemaName}.${RoomSchema.schema.id.name}, ${RoomSchema.schemaName}.${RoomSchema.schema.name.name}, ${RoomSchema.schema.price.name}, ${RoomSchema.schema.hotelid.name}, ${RoomSchema.schema.status.name}, ${RoomSchema.schemaName}.${RoomSchema.schema.createAt.name} FROM ${RoomSchema.schemaName}, ${HotelSchema.schemaName} WHERE ${RoomSchema.schema.hotelid.name} = @${HotelSchema.schema.id.name}`
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

  let now = new Date();
  room.createAt = now.toISOString();
  let insertData = RoomSchema.validateData(room);
  let query = `INSERT INTO ${RoomSchema.schemaName}`;
  const { request, insertFieldNamesStr, insertValuesStr } =
    dbUtils.getInsertQuery(
      RoomSchema.schema,
      dbConfig.db.pool.request(),
      insertData
    );
  query += " (" + insertFieldNamesStr + ") VALUES (" + insertValuesStr + ")";
  let result = await request.query(query);
  await HotelDAO.updateEmtyRoomHotel("insert");
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
  let result = await request
    .input(RoomSchema.schema.id.name, RoomSchema.schema.id.sqlType, id)
    .query(
      `DELETE ${RoomSchema.schemaName} WHERE ${RoomSchema.schema.id.name} = @${RoomSchema.schema.id.name}`
    );
  await HotelDAO.updateEmtyRoomHotel("delete");
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

exports.getRoomByCreateAt = async (createat) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  const request = dbConfig.db.pool.request();
  let result = await request
    .input(
      RoomSchema.schema.createAt.name,
      RoomSchema.schema.createAt.sqlType,
      createat
    )
    .query(
      `SELECT * FROM ${RoomSchema.schemaName} WHERE ${RoomSchema.schema.createAt.name} = @${RoomSchema.schema.createAt.name}`
    );
  return result.recordsets[0][0];
};
