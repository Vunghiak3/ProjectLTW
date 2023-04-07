const dbConfig = require("../database/dbconfig");
const dbUtils = require("../utils/dbUtils");
const StaticData = require("../utils/StaticData");
const AirPortSchema = require("../model/airPort");

exports.getAllAirPort = async (filter) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  const page = filter.page * 1 || 1;
  let query = `SELECT * FROM ${AirPortSchema.schemaName}`;

  let countQuery = `SELECT COUNT(DISTINCT ${AirPortSchema.schema.id.name}) AS totalItem FROM ${AirPortSchema.schemaName}`;

  let pageSize = filter.pageSize * 1 || StaticData.config.MAX_PAGE_SIZE;
  if (pageSize > StaticData.config.MAX_PAGE_SIZE) {
    pageSize = StaticData.config.MAX_PAGE_SIZE;
  }
  const { filterStr, paginationStr } = dbUtils.getFilterQuery(
    AirPortSchema.schema,
    filter,
    page,
    pageSize,
    AirPortSchema.defaultSort
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
  let airPorts = result.recordsets[0];

  return {
    page,
    pageSize,
    totalPage,
    totalItem,
    airPorts: airPorts,
  };
};

exports.getAirPortByID = async function (id) {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let result = await dbConfig.db.pool
    .request()
    .input(AirPortSchema.schema.id.name, AirPortSchema.schema.id.sqlType, id)
    .query(
      `SELECT * FROM ${AirPortSchema.schemaName} WHERE ${AirPortSchema.schema.id.name} = @${AirPortSchema.schema.id.name}`
    );
  let airPort = result.recordsets[0][0];
  return airPort;
};

exports.getAirPortByCreateAt = async (createat) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      AirPortSchema.schema.createAt.name,
      AirPortSchema.schema.createAt.sqlType,
      createat
    )
    .query(
      `SELECT * FROM ${AirPortSchema.schemaName} WHERE ${AirPortSchema.schema.createAt.name} = @${AirPortSchema.schema.createAt.name}`
    );
  return result.recordsets[0][0];
};

exports.createAirPort = async (airPort) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!airPort) {
    throw new Error("Invalid input param!");
  }
  let now = new Date();
  airPort.createAt = now.toISOString();
  let insertData = AirPortSchema.validateData(airPort);
  let query = `INSERT INTO ${AirPortSchema.schemaName}`;
  const { request, insertFieldNamesStr, insertValuesStr } =
    dbUtils.getInsertQuery(
      AirPortSchema.schema,
      dbConfig.db.pool.request(),
      insertData
    );
  query += " (" + insertFieldNamesStr + ") VALUES (" + insertValuesStr + ")";
  let result = await request.query(query);
  return result.recordsets;
};

exports.deleteAirPortById = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(AirPortSchema.schema.id.name, AirPortSchema.schema.id.sqlType, id)
    .query(
      `delete ${AirPortSchema.schemaName} where ${AirPortSchema.schema.id.name} = @${AirPortSchema.schema.id.name}`
    );

  return result.recordsets;
};

exports.updateAirPortById = async (id, updateInfo) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!updateInfo) {
    throw new Error("Invalid input param!");
  }
  let query = `UPDATE ${AirPortSchema.schemaName} SET`;
  const { request, updateStr } = dbUtils.getUpdateQuery(
    AirPortSchema.schema,
    dbConfig.db.pool.request(),
    updateInfo
  );
  if (!updateStr) {
    throw new Error("Invalid update param!");
  }
  request.input(
    AirPortSchema.schema.id.name,
    AirPortSchema.schema.id.sqlType,
    id
  );
  query +=
    " " +
    updateStr +
    ` WHERE ${AirPortSchema.schema.id.name} = @${AirPortSchema.schema.id.name}`;
  let result = await request.query(query);
  return result.recordsets;
}; //done
