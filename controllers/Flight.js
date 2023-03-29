const FlightDAO = require("./../DAO/FlightsDAO");

exports.checkFlights = async (req, res, next, val, val2, val3) => {
  try {
    const dateOfDepartment = val;
    const fromLocation = val2;
    const toLocation = val3;
    let flight = await FlightDAO.getFightsByDate(
      dateOfDepartment,
      fromLocation,
      toLocation
    );
    if (!flight) {
      return res
        .status(404) /// 404 - NOT FOUND!
        .json({
          code: 404,
          msg: `Flight not existed`,
        });
    }
  } catch (e) {
    console.error(e);
    return res
      .status(500) // 500 - Internal Error
      .json({
        code: 500,
        msg: e.toString(),
      });
  }
};
//CRUD OPERATION
exports.getFlights = async (req, res) => {
  try {
    const flight = req.flight;
    res.status(200).json({
      code: 200,
      msg: "OK",
      data: { flight },
    });
  } catch (e) {
    console.error(e);
    res
      .status(500) // 500 - Internal Error
      .json({
        code: 500,
        msg: e.toString(),
      });
  }
};
