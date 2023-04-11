const dbConfig = require("../database/dbconfig");
const dbUtils = require("../utils/dbUtils");
const StaticData = require("../utils/StaticData");
const ClassSchema = require("../model/AirLineClass");

exports.getAllClass = async (filter) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  const page = filter.page * 1 || 1;
  let query = `SELECT * FROM ${ClassSchema.schemaName}`;

  let countQuery = `SELECT COUNT(DISTINCT ${ClassSchema.schema.id.name}) AS totalItem FROM ${ClassSchema.schemaName}`;

  let pageSize = filter.pageSize * 1 || StaticData.config.MAX_PAGE_SIZE;
  if (pageSize > StaticData.config.MAX_PAGE_SIZE) {
    pageSize = StaticData.config.MAX_PAGE_SIZE;
  }
  const { filterStr, paginationStr } = dbUtils.getFilterQuery(
    ClassSchema.schema,
    filter,
    page,
    pageSize,
    ClassSchema.defaultSort
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
  let classes = result.recordsets[0];

  return {
    page,
    pageSize,
    totalPage,
    totalItem,
    classes: classes,
  };
};

exports.getClassByCreateAt = async (createat) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      ClassSchema.schema.createAt.name,
      ClassSchema.schema.createAt.sqlType,
      createat
    )
    .query(
      `SELECT * FROM ${ClassSchema.schemaName} WHERE ${ClassSchema.schema.createAt.name} = @${ClassSchema.schema.createAt.name}`
    );
  return result.recordsets[0][0];
};

exports.createClass = async (classes) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!classes) {
    throw new Error("Invalid input param!");
  }
  let now = new Date();
  classes.createAt = now.toISOString();
  let insertData = ClassSchema.validateData(classes);
  let query = `INSERT INTO ${ClassSchema.schemaName}`;
  const { request, insertFieldNamesStr, insertValuesStr } =
    dbUtils.getInsertQuery(
      ClassSchema.schema,
      dbConfig.db.pool.request(),
      insertData
    );
  query += " (" + insertFieldNamesStr + ") VALUES (" + insertValuesStr + ")";
  let result = await request.query(query);
  return result.recordsets;
};

exports.deleteClassById = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(ClassSchema.schema.id.name, ClassSchema.schema.id.sqlType, id)
    .query(
      `delete ${ClassSchema.schemaName} where ${ClassSchema.schema.id.name} = @${ClassSchema.schema.id.name}`
    );

  return result.recordsets;
};

exports.updateClassById = async (id, updateInfo) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  if (!updateInfo) {
    throw new Error("Invalid input param!");
  }
  let query = `UPDATE ${ClassSchema.schemaName} SET`;
  const { request, updateStr } = dbUtils.getUpdateQuery(
    ClassSchema.schema,
    dbConfig.db.pool.request(),
    updateInfo
  );
  if (!updateStr) {
    throw new Error("Invalid update param!");
  }
  request.input(ClassSchema.schema.id.name, ClassSchema.schema.id.sqlType, id);
  query +=
    " " +
    updateStr +
    ` WHERE ${ClassSchema.schema.id.name} = @${ClassSchema.schema.id.name}`;
  let result = await request.query(query);
  return result.recordsets;
};

exports.getClassByID = async function (id) {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let result = await dbConfig.db.pool
    .request()
    .input(ClassSchema.schema.id.name, ClassSchema.schema.id.sqlType, id)
    .query(
      `SELECT * FROM ${ClassSchema.schemaName} WHERE ${ClassSchema.schema.id.name} = @${ClassSchema.schema.id.name}`
    );
  let classes = result.recordsets[0][0];
  return classes;
};
