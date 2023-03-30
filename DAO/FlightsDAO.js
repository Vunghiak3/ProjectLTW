const dbConfig = require("../database/dbconfig");
const dbUtils = require("../utils/dbUtils");
const StaticData = require("../utils/StaticData");
const FlightSchema = require("../model/Flights");

exports.getFlightByDateAndLocation = async function (fromLocation, toLocation) {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let result = await dbConfig.db.pool
    .request()
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
      `SELECT * from ${FlightSchema.schemaName} where ${FlightSchema.schema.fromLocation.name} = @${FlightSchema.schema.fromLocation.name} AND ${FlightSchema.schema.toLocation.name} = @${FlightSchema.schema.toLocation.name}`
    );

  if (result.recordsets[0].length > 0) {
    return result.recordsets[0][0];
  }
  return null;
};
