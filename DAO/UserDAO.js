const dbConfig = require("./../database/dbconfig");
const dbUtils = require("./../utils/dbUtils");
const StaticData = require("./../utils/StaticData");
const bcrypt = require("bcryptjs");
const UserSchema = require("./../Model/User");

exports.getAllUsers = async function (filter) {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }

  let query = `SELECT * FROM ${UserSchema.schemaName}`;
  let countQuery = `SELECT COUNT(DISTINCT ${UserSchema.schema.id.name}) AS totalItem FROM ${UserSchema.schemaName}`;

  const page = filter.page * 1 || 1;
  let pageSize = filter.pageSize * 1 || StaticData.config.MAX_PAGE_SIZE;
  if (pageSize > StaticData.config.MAX_PAGE_SIZE) {
    pageSize = StaticData.config.MAX_PAGE_SIZE;
  }

  const { filterStr, paginationStr } = dbUtils.getFilterQuery(
    UserSchema.schema,
    filter,
    page,
    pageSize,
    UserSchema.defaultSort
  );

  if (filterStr) {
    query += " " + filterStr;
    countQuery += " " + filterStr;
  }
  console.log("🚀 ~ file: UserDAO.js:32 ~ countQuery:", countQuery);

  if (paginationStr) {
    query += " " + paginationStr;
  }
  console.log("🚀 ~ file: UserDAO.js:36 ~ query:", query);

  let result = await dbConfig.db.pool.request().query(query);
  let countResult = await dbConfig.db.pool.request().query(countQuery);

  let totalItem = 0;
  if (countResult.recordsets[0].length > 0) {
    totalItem = countResult.recordsets[0][0].totalItem;
  }
  let totalPage = Math.ceil(totalItem / pageSize);

  return {
    page,
    pageSize,
    totalPage,
    totalItem,
    users: result.recordsets[0],
  };
};

exports.getUserByUserName = async (name) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      UserSchema.schema.username.name,
      UserSchema.schema.username.sqlType,
      name
    )
    .query(
      `SELECT * FROM ${UserSchema.schemaName} WHERE ${UserSchema.schema.username.name} = @${UserSchema.schema.username.name}`
    );

  if (result.recordsets[0].length > 0) {
    return result.recordsets[0][0];
  }

  return null;
};

exports.addUser = async (user) => {
  console.log("🚀 ~ file: UserDAO.js:81 ~ exports.addUser= ~ user:", user)
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }

  let now = new Date().toISOString();
  user.passwordAt = now;
  user.createAt = now;

  if (!user.roleid) {
    throw new Error("Invalid user role!");
  }

  let insertData = UserSchema.validateData(user);

  insertData.password = await bcrypt.hash(insertData.password, 10);

  let query = `INSERT INTO ${UserSchema.schemaName}`;

  const { request, insertFieldNamesStr, insertValuesStr } =
    dbUtils.getInsertQuery(
      UserSchema.schema,
      dbConfig.db.pool.request(),
      insertData
    );
  if (!insertFieldNamesStr || !insertValuesStr) {
    throw new Error("Invalid insert param!");
  }

  query += " (" + insertFieldNamesStr + ") VALUES (" + insertValuesStr + ")";

  let result = await request.query(query);

  return result.recordsets;
};

exports.updateUser = async (id, updateUser) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }

  if (!updateUser) {
    throw new Error("Invalid update param");
  }

  if (updateUser.password) {
    updateUser.password = await bcrypt.hash(updateUser.password, 10);
    const now = new Date().toISOString();
    updateUser.passwordAt = now;
  }

  let query = `UPDATE ${UserSchema.schemaName} SET`;

  const { request, updateStr } = dbUtils.getUpdateQuery(
    UserSchema.schema,
    dbConfig.db.pool.request(),
    updateUser
  );
  if (!updateStr) {
    throw new Error("Invalid update param");
  }

  request.input(UserSchema.schema.id.name, UserSchema.schema.id.sqlType, id);
  query +=
    " " +
    updateStr +
    ` WHERE ${UserSchema.schema.id.name} = @${UserSchema.schema.id.name}`;

  let result = await request.query(query);
  return result.recordsets;
};

exports.getUser = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let result = await dbConfig.db.pool
    .request()
    .input(UserSchema.schema.id.name, UserSchema.schema.id.sqlType, id)
    .query(
      `SELECT * FROM ${UserSchema.schemaName} WHERE ${UserSchema.schema.id.name} = @${UserSchema.schema.id.name}`
    );
  if (result.recordsets[0].length > 0) {
    return result.recordsets[0][0];
  }

  return null;
};

exports.deleteUser = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }

  let result = dbConfig.db.pool
    .request()
    .input(UserSchema.schema.id.name, UserSchema.schema.id.sqlType, id)
    .query(
      `DELETE ${UserSchema.schemaName} WHERE ${UserSchema.schema.id.name} = @${UserSchema.schema.id.name}`
    );

  return result.recordsets;
};

exports.getUserByEmail = async (email) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let result = await dbConfig.db.pool
    .request()
    .input(UserSchema.schema.email.name, UserSchema.schema.email.sqlType, email)
    .query(
      `SELECT * FROM ${UserSchema.schemaName} WHERE ${UserSchema.schema.email.name} = @${UserSchema.schema.email.name}`
    );

  if (result.recordsets[0].length > 0) {
    return result.recordsets[0][0];
  }

  return null;
};
