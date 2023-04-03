const FlightDAO = require("./../DAO/FlightsDAO");
const SeatDAO = require("./../DAO/SeatDAO");
//CRUD OPERATION
exports.getAllFlight = async (req, res) => {
  try {
    const { page, pageSize, totalPage, totalItem, flights } =
      await FlightDAO.getAllFlights(req.query);
    return res.status(200).json({
      code: 200,
      msg: "OK",
      page,
      pageSize,
      totalPage,
      totalItem,
      data: {
        flights,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};
exports.getFlightById = async (req, res, next) => {
  const id = req.params.id;
  try {
    let flight = await FlightDAO.getFlightsByID(id);
    if (!flight) {
      return res.status(404).json({
        code: 404,
        msg: `Flight not existed`,
      });
    } else {
      res.status(200).json({
        code: 200,
        msg: `OK`,
        data: {
          flight,
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
      return res.status(404).json({
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

exports.createFlight = async (req, res) => {
  const newFlight = req.body;
  try {
    await FlightDAO.createFlights(newFlight);
    const flight = await FlightDAO.getFlightsByName(newFlight.name);
    return res.status(200).json({
      code: 200,
      msg: "Create new flight successfully!",
      data: { flight },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

exports.deleteFlight = async (req, res) => {
  try {
    const id = req.params.id * 1;
    await SeatDAO.deleteSeatById(id);
    //await AirportDAO.deleteByAirportId(id);
    // await FlightBookingDAO.deleteById(id);
    await FlightDAO.deleteFlightById(id);
    return res.status(200).json({
      code: 200,
      msg: `Delete flight with ${id} successfully!`,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

exports.updateFlight = async (req, res) => {
  try {
    const id = req.params.id * 1;
    const updateInfo = req.body;
    await FlightDAO.updateFlightById(id, updateInfo);
    const flight = await FlightDAO.getFlightsByID(id);
    return res.status(200).json({
      code: 200,
      msg: `Update tour flight id: ${id} successfully!`,
      data: {
        flight,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};
