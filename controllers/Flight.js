const FlightDAO = require("./../DAO/FlightsDAO");

// exports.checkFlights = async (req, res, next, val, val2, val3) => {
//   try {
//     // const dateOfDepartment = val;
//     const fromLocation = val2;
//     const toLocation = val3;
//     let flight = await FlightDAO.getFightsByDate(
//       // dateOfDepartment,
//       fromLocation,
//       toLocation
//     );
//     if (!flight) {
//       return res.status(404).json({
//         code: 404,
//         msg: `Flight not existed`,
//       });
//     }
//     req.flight = flight;
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({
//       code: 500,
//       msg: e.toString(),
//     });
//   }
//   next();
// };

//CRUD OPERATION
exports.getFlightByLocation = async (req, res, next) => {
  const fromLocation = req.query.from;
  const toLocation = req.query.to;
  try {
    let flights = await FlightDAO.getFlightByDateAndLocation(
      fromLocation,
      toLocation
    );
    if (!flights) {
      return res
        .status(404) /// 404 - NOT FOUND!
        .json({
          code: 404,
          msg: `Flight not existed`,
        });
    } else {
      res.status(200).json({
        code: 200,
        msg: `OK`,
        data: {
          flights,
        },
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};
