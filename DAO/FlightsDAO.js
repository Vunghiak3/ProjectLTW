const dbConfig = require("../database/dbconfig");
const dbUtils = require("../utils/dbUtils");
const StaticData = require("../utils/StaticData");
const FlightSchema = require("../model/Flights");

exports.getAllFlights = async (filter) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  const page = filter.page * 1 || 1;
  let query = `SELECT * FROM ${FlightSchema.schemaName}`;

  let countQuery = `SELECT COUNT(DISTINCT ${FlightSchema.schema.id.name}) AS totalItem FROM ${FlightSchema.schemaName}`;

  let pageSize = filter.pageSize * 1 || StaticData.config.MAX_PAGE_SIZE;
  if (pageSize > StaticData.config.MAX_PAGE_SIZE) {
    pageSize = StaticData.config.MAX_PAGE_SIZE;
  }
  const { filterStr, paginationStr } = dbUtils.getFilterQuery(
    FlightSchema.schema,
    filter,
    page,
    pageSize,
    FlightSchema.defaultSort
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
  let flights = result.recordsets[0];

  return {
    page,
    pageSize,
    totalPage,
    totalItem,
    flights: flights,
  };
};

exports.getFlightsByID = async function (id) {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let result = await dbConfig.db.pool
    .request()
    .input(FlightSchema.schema.id.name, FlightSchema.schema.id.sqlType, id)
    .query(
      `SELECT * FROM ${FlightSchema.schemaName} WHERE ${FlightSchema.schema.id.name} = @${FlightSchema.schema.id.name}`
    );
  let flight = result.recordsets[0][0];
  return flight;
};

exports.getFlightsByName = async function (name) {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let result = await dbConfig.db.pool
    .request()
    .input(
      FlightSchema.schema.name.name,
      FlightSchema.schema.name.sqlType,
      name
    )
    .query(
      `SELECT * FROM ${FlightSchema.schemaName} WHERE ${FlightSchema.schema.name.name} = @${FlightSchema.schema.name.name}`
    );
  let flight = result.recordsets[0][0];
  return flight;
};

exports.getFlightByDateAndLocation = async function (
  dateOfDepartment,
  fromLocation,
  toLocation
) {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let result = await dbConfig.db.pool
    .request()
    .input(
      FlightSchema.schema.dateOfDepartment.name,
      FlightSchema.schema.dateOfDepartment.sqlType,
      dateOfDepartment
    )
    .input(
      FlightSchema.schema.fromLocation.name,
      FlightSchema.schema.fromLocation.sqlType,
      fromLocation
    )
    .input(
      FlightSchema.schema.toLocation.name,
      FlightSchema.schema.toLocation.sqlType,
      toLocation
    )
    .query(
      `SELECT * from ${FlightSchema.schemaName} where ${FlightSchema.schema.fromLocation.name} = @${FlightSchema.schema.fromLocation.name} AND ${FlightSchema.schema.toLocation.name} = @${FlightSchema.schema.toLocation.name} AND ${FlightSchema.schema.dateOfDepartment.name}=@${FlightSchema.schema.dateOfDepartment.name}`
    );

  if (result.recordsets[0].length > 0) {
    return result.recordsets[0][0];
  }
  return null;
};

exports.createFlights = async (flight) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!flight) {
    throw new Error("Invalid input param!");
  }
  let now = new Date();
  flight.createAt = now.toISOString();
  let insertData = FlightSchema.validateData(flight);
  let query = `INSERT INTO ${FlightSchema.schemaName}`;
  const { request, insertFieldNamesStr, insertValuesStr } =
    dbUtils.getInsertQuery(
      FlightSchema.schema,
      dbConfig.db.pool.request(),
      insertData
    );
  query += " (" + insertFieldNamesStr + ") VALUES (" + insertValuesStr + ")";
  let result = await request.query(query);
  return result.recordsets;
};

exports.deleteFlightById = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(FlightSchema.schema.id.name, FlightSchema.schema.id.sqlType, id)
    .query(
      `delete ${FlightSchema.schemaName} where ${FlightSchema.schema.id.name} = @${FlightSchema.schema.id.name}`
    );

  return result.recordsets;
};

exports.updateFlightById = async (id, updateInfo) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!updateInfo) {
    throw new Error("Invalid input param!");
  }
  let query = `UPDATE ${FlightSchema.schemaName} SET`;
  const { request, updateStr } = dbUtils.getUpdateQuery(
    FlightSchema.schema,
    dbConfig.db.pool.request(),
    updateInfo
  );
  if (!updateStr) {
    throw new Error("Invalid update param!");
  }
  request.input(
    FlightSchema.schema.id.name,
    FlightSchema.schema.id.sqlType,
    id
  );
  query +=
    " " +
    updateStr +
    ` WHERE ${FlightSchema.schema.id.name} = @${FlightSchema.schema.id.name}`;
  let result = await request.query(query);
  return result.recordsets;
};
