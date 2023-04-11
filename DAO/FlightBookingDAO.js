const dbConfig = require("../database/dbconfig");
const dbUtils = require("../utils/dbUtils");
const StaticData = require("../utils/StaticData");

const FlightBookingSchema = require("../model/FlightBooking");
const FlightSchema = require("../model/Flights");
const SeatSchema = require("../model/Seat");
const AirPortSchema = require("../model/airPort");
const ClassSchema = require("../model/AirLineClass");

const e = require("express");
exports.getAllBooking = async (filter) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  const page = filter.page * 1 || 1;
  let query = `SELECT * FROM ${FlightBookingSchema.schemaName}`;

  let countQuery = `SELECT COUNT(DISTINCT ${FlightBookingSchema.schema.id.name}) AS totalItem FROM ${FlightBookingSchema.schemaName}`;

  let pageSize = filter.pageSize * 1 || StaticData.config.MAX_PAGE_SIZE;
  if (pageSize > StaticData.config.MAX_PAGE_SIZE) {
    pageSize = StaticData.config.MAX_PAGE_SIZE;
  }
  const { filterStr, paginationStr } = dbUtils.getFilterQuery(
    FlightBookingSchema.schema,
    filter,
    page,
    pageSize,
    FlightBookingSchema.defaultSort
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
  let bookings = result.recordsets[0];

  return {
    page,
    pageSize,
    totalPage,
    totalItem,
    bookings: bookings,
  };
};

exports.getBookingByID = async function (id) {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let result = await dbConfig.db.pool
    .request()
    .input(
      FlightBookingSchema.schema.id.name,
      FlightBookingSchema.schema.id.sqlType,
      id
    )
    .query(
      `SELECT bf.*, ac.name, ap.name
      FROM ${FlightBookingSchema.schemaName} bf
      JOIN ${SeatSchema.schemaName} s ON bf.${FlightBookingSchema.schema.SeatId.name} = s.id
      JOIN ${ClassSchema.schemaName} ac ON s.${SeatSchema.schema.AirlineClassId.name} = ac.${ClassSchema.schema.id.name}
      JOIN ${FlightSchema.schemaName} f ON bf.${FlightBookingSchema.schema.FlightId.name} = f.id
      JOIN  ${AirPortSchema.schemaName} ap ON f.${FlightSchema.schema.airportID.name} = ap.id
      WHERE bf.${FlightBookingSchema.schema.id.name} = @${FlightBookingSchema.schema.id.name}`
    );
  let booking = result.recordsets[0][0];
  return booking;
};

exports.getBookingByUserID = async function (id) {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let result = await dbConfig.db.pool
    .request()
    .input(
      FlightBookingSchema.schema.UserId.name,
      FlightBookingSchema.schema.UserId.sqlType,
      id
    )
    .query(
      `SELECT bf.*, ac.name, ap.name
      FROM ${FlightBookingSchema.schemaName} bf
      JOIN ${SeatSchema.schemaName} s ON bf.${FlightBookingSchema.schema.SeatId.name} = s.${SeatSchema.schema.id.name}
      JOIN ${ClassSchema.schemaName} ac ON s.${SeatSchema.schema.AirlineClassId.name} = ac.${ClassSchema.schema.id.name}
      JOIN ${FlightSchema.schemaName} f ON bf.${FlightBookingSchema.schema.FlightId.name} = f.${FlightSchema.schema.id.name}
      JOIN  ${AirPortSchema.schemaName} ap ON f.${FlightSchema.schema.airportID.name} = ap.${AirPortSchema.schema.id.name}
      WHERE bf.${FlightBookingSchema.schema.UserId.name} = @${FlightBookingSchema.schema.UserId.name}`
    );
  let booking = result.recordsets;
  return booking;
};

exports.getBookingByCreateAt = async (createat) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      FlightBookingSchema.schema.createAt.name,
      FlightBookingSchema.schema.createAt.sqlType,
      createat
    )
    .query(
      `SELECT * FROM ${FlightBookingSchema.schemaName} WHERE ${FlightBookingSchema.schema.createAt.name} = @${FlightBookingSchema.schema.createAt.name}`
    );
  return result.recordsets[0][0];
};

exports.createBooking = async (booking) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!booking) {
    throw new Error("Invalid input param!");
  }
  let now = new Date();
  booking.createAt = now.toISOString();
  let insertData = FlightBookingSchema.validateData(booking);

  let query = `INSERT INTO ${FlightBookingSchema.schemaName}`;
  const { request, insertFieldNamesStr, insertValuesStr } =
    dbUtils.getInsertQuery(
      FlightBookingSchema.schema,
      dbConfig.db.pool.request(),
      insertData
    );

  query += " (" + insertFieldNamesStr + ") VALUES (" + insertValuesStr + ")";
  let result = await request.query(query);

  return result.recordsets;
};

exports.deleteBookingById = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      FlightBookingSchema.schema.id.name,
      FlightBookingSchema.schema.id.sqlType,
      id
    )
    .query(
      `delete ${FlightBookingSchema.schemaName} where ${FlightBookingSchema.schema.id.name} = @${FlightBookingSchema.schema.id.name}`
    );

  return result.recordsets;
};

exports.deleteBySeatId = async (SeatId) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      FlightBookingSchema.schema.SeatId.name,
      FlightBookingSchema.schema.SeatId.sqlType,
      SeatId
    )
    .query(
      `delete ${FlightBookingSchema.schemaName} where ${FlightBookingSchema.schema.SeatId.name} = @${FlightBookingSchema.schema.SeatId.name}`
    );

  return result.recordsets;
};

exports.deleteByFlightId = async (FlightId) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      FlightBookingSchema.schema.FlightId.name,
      FlightBookingSchema.schema.FlightId.sqlType,
      FlightId
    )
    .query(
      `delete ${FlightBookingSchema.schemaName} where ${FlightBookingSchema.schema.FlightId.name} = @${FlightBookingSchema.schema.FlightId.name}`
    );

  return result.recordsets;
};

exports.updateBookingById = async (id, updateInfo) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!updateInfo) {
    throw new Error("Invalid input param!");
  }
  let query = `UPDATE ${FlightBookingSchema.schemaName} SET`;
  const { request, updateStr } = dbUtils.getUpdateQuery(
    FlightBookingSchema.schema,
    dbConfig.db.pool.request(),
    updateInfo
  );
  if (!updateStr) {
    throw new Error("Invalid update param!");
  }
  request.input(
    FlightBookingSchema.schema.id.name,
    FlightBookingSchema.schema.id.sqlType,
    id
  );
  query +=
    " " +
    updateStr +
    ` WHERE ${FlightBookingSchema.schema.id.name} = @${FlightBookingSchema.schema.id.name}`;
  let result = await request.query(query);
  return result.recordsets;
};

exports.CancelBooking = async (id, updateInfo, userId) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!updateInfo) {
    throw new Error("Invalid input param!");
  }
  let query = `UPDATE ${FlightBookingSchema.schemaName} SET`;
  const { request, updateStr } = dbUtils.getUpdateQuery(
    FlightBookingSchema.schema,
    dbConfig.db.pool.request(),
    updateInfo
  );
  if (!updateStr) {
    throw new Error("Invalid update param!");
  }
  request.input(
    FlightBookingSchema.schema.id.name,
    FlightBookingSchema.schema.id.sqlType,
    id
  );
  request.input(
    FlightBookingSchema.schema.UserId.name,
    FlightBookingSchema.schema.UserId.sqlType,
    userId
  );
  query +=
    " " +
    updateStr +
    ` WHERE ${FlightBookingSchema.schema.id.name} = @${FlightBookingSchema.schema.id.name} 
      AND ${FlightBookingSchema.schema.UserId.name} = @${FlightBookingSchema.schema.UserId.name}`;
  let result = await request.query(query);
  return result.recordsets;
};

exports.deleteByClassId = async (AirlineClassId) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      SeatSchema.schema.AirlineClassId.name,
      SeatSchema.schema.AirlineClassId.sqlType,
      AirlineClassId
    )
    .query(
      `delete ${FlightBookingSchema.schemaName} where ${FlightBookingSchema.schema.SeatId.name} IN (Select ${SeatSchema.schema.id.name} from ${SeatSchema.schemaName} where  ${SeatSchema.schema.AirlineClassId.name} = @${SeatSchema.schema.AirlineClassId.name})`
    );

  return result.recordsets;
};

exports.checkingBookingByClass = async (AirlineClassId) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!AirlineClassId) {
    throw new Error("Invalid input param!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      SeatSchema.schema.AirlineClassId.name,
      SeatSchema.schema.AirlineClassId.sqlType,
      AirlineClassId
    )
    .query(
      `SELECT * FROM ${FlightBookingSchema.schemaName} where ${FlightBookingSchema.schema.SeatId.name} IN (Select ${SeatSchema.schema.id.name} from ${SeatSchema.schemaName} where  ${SeatSchema.schema.AirlineClassId.name} = @${SeatSchema.schema.AirlineClassId.name})`
    );
  return result.recordsets[0][0];
};
