const dbConfig = require("./../database/dbconfig");
const dbUtils = require("./../utils/dbUtils");
const StaticData = require("./../utils/StaticData");
const BookingRoomSchema = require("./../Model/BookingRoom");

exports.getAllBookingRoom = async (filter) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db!");
  }
  let query = `SELECT * FROM ${BookingRoomSchema.schemaName}`;
  let countQuery = `SELECT COUNT(DISTINCT ${BookingRoomSchema.schema.id.nam}) AS totalItem FROM ${BookingRoomSchema.schemaName}`;

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
};
