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

// exports.findRooms = async (info) => {
//   if (!dbConfig.db.pool) {
//     throw new Error("Not connected to db!");
//   }
//   let query = `SELECT ${RoomSchema.schemaName}.${RoomSchema.schema.id.name}, ${RoomSchema.schemaName}.${RoomSchema.schema.name.name}, ${RoomSchema.schema.price.name}, ${RoomSchema.schema.status.name},`;
//   let from = `FROM ${RoomSchema.schemaName}`;
//   let where = "";
//   if (info.city) {
//     query += ` ${HotelSchema.schemaName}.${HotelSchema.schema.name.name} AS NameHotel, ${HotelSchema.schema.city.name}, ${HotelSchema.schema.address.name}`;
//     from += `, ${HotelSchema.schemaName}`;
//     where += `WHERE ${RoomSchema.schema.hotelid.name} = ${HotelSchema.schemaName}.${HotelSchema.schema.id.name} AND ${HotelSchema.schema.city.name} = @${HotelSchema.schema.city.name} AND ${RoomSchema.schema.status.name} = 'FALSE'`;
//   }
//   query += " " + from + " " + where;
//   console.log("🚀 ~ file: RoomDAO.js:79 ~ exports.findRooms= ~ query:", query);
//   let result = await dbConfig.db.pool
//     .request()
//     .input(
//       HotelSchema.schema.city.name,
//       HotelSchema.schema.city.sqlType,
//       info.city
//     )
//     .query(query);
//   return result.recordsets[0];
// };

exports.findRooms = async (info) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let query = `
    SELECT DISTINCT ${RoomSchema.schemaName}.${RoomSchema.schema.id.name}, 
           ${RoomSchema.schemaName}.${RoomSchema.schema.name.name}, 
           ${RoomSchema.schemaName}.${RoomSchema.schema.price.name}, 
           ${RoomSchema.schemaName}.${RoomSchema.schema.status.name}`;

  let from = `FROM ${RoomSchema.schemaName}`;

  let where = "";

  if (info.city) {
    request.input(
      HotelSchema.schema.city.name,
      HotelSchema.schema.city.sqlType,
      info.city
    );
    query += `, ${HotelSchema.schemaName}.${HotelSchema.schema.name.name} AS NameHotel, 
              ${HotelSchema.schema.city.name}, 
              ${HotelSchema.schema.address.name}`;

    from += `, ${HotelSchema.schemaName}`;

    where += `WHERE ${RoomSchema.schemaName}.${RoomSchema.schema.hotelid.name} = ${HotelSchema.schemaName}.${HotelSchema.schema.id.name} 
              AND ${HotelSchema.schema.city.name} = @${HotelSchema.schema.city.name} 
              AND ${RoomSchema.schemaName}.${RoomSchema.schema.status.name} = 'FALSE'`;
  }

  if (info.checkindate) {
    console.log("🚀 ~ file: RoomDAO.js:125 ~ exports.findRooms= ~ info.checkindate:", info.checkindate)
    request.input(
      BookingRoomSchema.schema.checkindate.name,
      BookingRoomSchema.schema.checkindate.sqlType,
      info.checkindate
    );
    from += `, ${BookingRoomSchema.schemaName} `;
    where += where ? " AND " : "WHERE ";
    where += `${BookingRoomSchema.schema.checkoutdate.name} < @${BookingRoomSchema.schema.checkindate.name}`;
    // AND ${BookingRoomSchema.schema.roomid.name} = ${RoomSchema.schemaName}.${RoomSchema.schema.id.name}
  }

  let queryStr = query + " " + from + " " + where;
  console.log("🚀 ~ file: RoomDAO.js:137 ~ exports.findRooms= ~ queryStr:", queryStr)

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
