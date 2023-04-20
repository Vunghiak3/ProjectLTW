const SeatSchema = require("../model/Seat");
const SeatDAO = require("./../DAO/SeatDAO");
const FlightBookingDAO = require("./../DAO/FlightBookingDAO");
exports.getAllSeats = async (req, res) => {
  try {
    const { page, pageSize, totalPage, totalItem, seats } =
      await SeatDAO.getAllSeats(req.query);
    return res.status(200).json({
      code: 200,
      msg: "OK",
      page,
      pageSize,
      totalPage,
      totalItem,
      data: {
        seats,
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
exports.getSeatById = async (req, res, next) => {
  const id = req.params.id;
  try {
    let seat = await SeatDAO.geetSeatById(id);
    if (!seat) {
      return res.status(404).json({
        code: 404,
        msg: `Seats not existed`,
      });
    } else {
      res.status(200).json({
        code: 200,
        msg: `OK`,
        data: {
          seat,
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
exports.createSeat = async (req, res) => {
  const newSeat = req.body;
  try {
    await SeatDAO.createSeat(newSeat);
    const seat = await SeatDAO.getSeatByCreateAt(newSeat.createAt);
    return res.status(200).json({
      code: 200,
      msg: "Create new seat successfully!",
      data: { seat },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};
exports.deleteBySeatId = async (req, res) => {
  try {
    const id = req.params.id * 1;
    await FlightBookingDAO.deleteBySeatId(id);
    await SeatDAO.deleteSeatById(id);
    return res.status(200).json({
      code: 200,
      msg: `Delete seat with ${id} successfully!`,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};
exports.updateSeat = async (req, res) => {
  try {
    const id = req.params.id * 1;
    const updateInfo = req.body;
    await SeatDAO.updateSeatById(id, updateInfo);
    const seat = await SeatDAO.geetSeatById(id);
    return res.status(200).json({
      code: 200,
      msg: `Update tour flight id: ${id} successfully!`,
      data: {
        seat,
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

exports.deleteAllByFlightId = async (req, res) => {
  try {
    const id = req.params.id * 1;
    await FlightBookingDAO.deleteByFlightId(id);
    await SeatDAO.deleteByFlightId(id);
    return res.status(200).json({
      code: 200,
      msg: `Delete all seat with flight ${id} successfully!`,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

exports.createAllSeat = async (req, res) => {
  try {
    const FlightId = req.params.id * 1;
    const totalSeat = req.body.totalSeatPerLine;
    const firstId = req.body.firstId;
    const ecoId = req.body.ecoId;
    await SeatDAO.createAllSeat(FlightId, totalSeat, firstId, ecoId);
    const seat = await SeatDAO.getSeatByFlightId(FlightId);
    return res.status(200).json({
      code: 200,
      msg: "Create new seat successfully!",
      data: { seat },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};
