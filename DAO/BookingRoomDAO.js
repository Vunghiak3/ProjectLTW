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
  let hotels = result.recordsets[0];
  return {
    page,
    pageSize,
    totalPage,
    totalItem,
    hotels: hotels,
  };
};

exports.createNewBookingRoom = async (newBookingRoom) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!newBookingRoom) {
    throw new Error("Invalid input param!");
  }
  let now = new Date();
  newBookingRoom.createAt = now.toISOString();
  console.log("🚀 ~ file: BookingRoomDAO.js:57 ~ exports.createNewBookingRoom= ~ newBookingRoom:", newBookingRoom)
  let insertData = BookingRoomSchema.validateData(newBookingRoom);
  console.log("🚀 ~ file: BookingRoomDAO.js:63 ~ exports.createNewBookingRoom= ~ insertData:", insertData)
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
  let bookingroom = request
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

// exports.findRooms = async(data)=>{
//   if(!dbConfig.db.pool){
//     throw new Error('Not connected to db!')
//   }
//   let query = `SELECT ${RoomSchema.schema.id.name}, ${RoomSchema.schema.name.name}, ${RoomSchema.schema.price.name}, ${RoomSchema.schema.status.name} FROM ${RoomSchema.schemaName}`
//   let where = ' WHERE'
//   if(data.city){
//     query += `, ${HotelSchema.schemaName}`
//     where += `${RoomSchema.schema.hotelid.name} = ${HotelSchema.schema.id.name}`
//   }
//   if(data.checkindate || data.numberday){
//     query += `, ${BookingRoomSchema.schemaName}`
//     where += `AND ${RoomSchema.schema.id.name} = ${BookingRoomSchema.schema.roomid.name}`
//   }

// }
