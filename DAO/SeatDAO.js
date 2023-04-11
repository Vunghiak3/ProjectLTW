const dbConfig = require("../database/dbconfig");
const dbUtils = require("../utils/dbUtils");
const StaticData = require("../utils/StaticData");
//const FlightSchema = require("../model/Flights");
const SeatSchema = require("../model/Seat");

exports.getAllSeats = async (filter) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  const page = filter.page * 1 || 1;
  let query = `SELECT * FROM ${SeatSchema.schemaName}`;

  let countQuery = `SELECT COUNT(DISTINCT ${SeatSchema.schema.id.name}) AS totalItem FROM ${SeatSchema.schemaName}`;

  let pageSize = filter.pageSize * 1 || StaticData.config.MAX_PAGE_SIZE;
  if (pageSize > StaticData.config.MAX_PAGE_SIZE) {
    pageSize = StaticData.config.MAX_PAGE_SIZE;
  }
  const { filterStr, paginationStr } = dbUtils.getFilterQuery(
    SeatSchema.schema,
    filter,
    page,
    pageSize,
    SeatSchema.defaultSort
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
  let seats = result.recordsets[0];

  return {
    page,
    pageSize,
    totalPage,
    totalItem,
    seats: seats,
  };
};
exports.geetSeatById = async function (id) {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let result = await dbConfig.db.pool
    .request()
    .input(SeatSchema.schema.id.name, SeatSchema.schema.id.sqlType, id)
    .query(
      `SELECT * FROM ${SeatSchema.schemaName} WHERE ${SeatSchema.schema.id.name} = @${SeatSchema.schema.id.name}`
    );
  let seat = result.recordsets[0][0];
  return seat;
};
exports.getSeatByCreateAt = async (date) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  const request = dbConfig.db.pool.request();
  let result = await request
    .input(
      SeatSchema.schema.createAt.name,
      SeatSchema.schema.createAt.sqlType,
      date
    )
    .query(
      `SELECT * FROM ${SeatSchema.schemaName} WHERE ${SeatSchema.schema.createAt.name} = @${SeatSchema.schema.createAt.name}`
    );
  return result.recordsets[0][0];
};
exports.createSeat = async (seat) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!seat) {
    throw new Error("Invalid input param!");
  }
  let now = new Date();
  seat.createAt = now.toISOString();
  let insertData = SeatSchema.validateData(seat);
  let query = `INSERT INTO ${SeatSchema.schemaName}`;
  const { request, insertFieldNamesStr, insertValuesStr } =
    dbUtils.getInsertQuery(
      SeatSchema.schema,
      dbConfig.db.pool.request(),
      insertData
    );
  query += " (" + insertFieldNamesStr + ") VALUES (" + insertValuesStr + ")";
  let result = await request.query(query);
  return result.recordsets;
};
exports.deleteSeatById = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(SeatSchema.schema.id.name, SeatSchema.schema.id.sqlType, id)
    .query(
      `delete ${SeatSchema.schemaName} where ${SeatSchema.schema.id.name} = @${SeatSchema.schema.id.name}`
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
      SeatSchema.schema.FlightId.name,
      SeatSchema.schema.FlightId.sqlType,
      FlightId
    )
    .query(
      `delete ${SeatSchema.schemaName} where ${SeatSchema.schema.FlightId.name} = @${SeatSchema.schema.FlightId.name}`
    );
  return result.recordsets;
};
exports.updateSeatById = async (id, updateInfo) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!updateInfo) {
    throw new Error("Invalid input param!");
  }
  let query = `UPDATE ${SeatSchema.schemaName} SET`;
  const { request, updateStr } = dbUtils.getUpdateQuery(
    SeatSchema.schema,
    dbConfig.db.pool.request(),
    updateInfo
  );
  if (!updateStr) {
    throw new Error("Invalid update param!");
  }
  request.input(SeatSchema.schema.id.name, SeatSchema.schema.id.sqlType, id);
  query +=
    " " +
    updateStr +
    ` WHERE ${SeatSchema.schema.id.name} = @${SeatSchema.schema.id.name}`;
  let result = await request.query(query);
  return result.recordsets;
};

exports.checkingSeats = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!id) {
    throw new Error("Invalid input param!");
  }
  let request = dbConfig.db.pool.request();
  let status = "FALSE";
  let result = await request
    .input(SeatSchema.schema.id.name, SeatSchema.schema.id.sqlType, id)
    .query(
      `SELECT * FROM ${SeatSchema.schemaName} WHERE ${SeatSchema.schema.id.name} = ${id} AND ${SeatSchema.schema.Status.name} = '${status}'`
    );
  return result.recordsets[0][0];
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
      `delete ${SeatSchema.schemaName} where ${SeatSchema.schema.AirlineClassId.name} = @${SeatSchema.schema.AirlineClassId.name}`
    );
  return result.recordsets;
};

exports.checkingSeatsByClass = async (AirlineClassId) => {
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
      `SELECT * FROM ${SeatSchema.schemaName} WHERE ${SeatSchema.schema.AirlineClassId.name} = @${SeatSchema.schema.AirlineClassId.name}`
    );
  return result.recordsets[0][0];
};
