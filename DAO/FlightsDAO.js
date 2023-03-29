const dbConfig = require("../database/dbconfig");
const dbUtils = require("../utils/dbUtils");
const StaticData = require("../utils/StaticData");
const FlightSchema = require("../model/Flights");

exports.getFightsByDate = async (
  dateOfDepartment,
  fromLocation,
  toLocation
) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
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
      `select * from ${FlightSchema.schemaName} where ${FlightSchema.schema.dateOfDepartment} = @${FlightSchema.schema.fromLocation.name} AND ${FlightSchema.schema.toLocation} = @${FlightSchema.schema.toLocation}`
    );
  return result.recordsets;
};
