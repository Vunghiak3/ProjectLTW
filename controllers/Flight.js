const FlightDAO = require("./../DAO/FlightsDAO");

//CRUD OPERATION
exports.getAllFlight = async (req, res, next) => {};

exports.getFlightByLocation = async (req, res, next) => {
  const dateOfDepartment = req.query.date;
  const fromLocation = req.query.from;
  const toLocation = req.query.to;
  try {
    let flights = await FlightDAO.getFlightByDateAndLocation(
      dateOfDepartment,
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
}; //Done

exports.createFlight = async (req, res) => {
  const newFlight = req.body;
  try {
    await FlightDAO.createFlights(newFlight);
    let flights = await FlightDAO.getFlightByDateAndLocation(
      newFlight.fromLocation,
      newFlight.toLocation
    );
    return res.status(200).json({
      code: 200,
      msg: `Create new flight successfully!`,
      data: {
        flights,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};
exports.deleteFlight = async (req, res) => {
  try {
    const id = req.params.id * 1;
    // await SeatDAO.deleteBySeatId(id);
    //await AirportDAO.deleteByAirportId(id);
    await FlightDAO.deleteFlightById(id);
    return res.status(200).json({
      code: 200,
      msg: `Delete flight with ${id} successfully!`,
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
}; //Done

exports.updateFlight = async (req, res) => {
  try {
    const id = req.params.id * 1;
    const updateInfo = req.body;
    await FlightDAO.updateFlightById(id, updateInfo);
    // const flight = await TourDAO.getFlightById(id); //todo
    return res.status(200).json({
      code: 200,
      msg: `Update tour flight id: ${id} successfully!`,
      data: {
        //flight,
      },
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
