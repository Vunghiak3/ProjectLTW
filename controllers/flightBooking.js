const FlightBookingDAO = require("./../DAO/FlightBookingDAO");

//CRUD OPERATION
exports.getAllBooking = async (req, res) => {
  try {
    const { page, pageSize, totalPage, totalItem, bookings } =
      await FlightBookingDAO.getAllBooking(req.query);
    return res.status(200).json({
      code: 200,
      msg: "OK",
      page,
      pageSize,
      totalPage,
      totalItem,
      data: {
        bookings,
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
exports.getBookingById = async (req, res, next) => {
  const id = req.params.id;
  try {
    let booking = await FlightBookingDAO.getBookingByID(id);
    if (!booking) {
      return res.status(404).json({
        code: 404,
        msg: `Booking not existed`,
      });
    } else {
      res.status(200).json({
        code: 200,
        msg: `OK`,
        data: {
          booking,
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

exports.createBooking = async (req, res) => {
  const newFlight = req.body;
  try {
    await FlightBookingDAO.createBooking(newFlight);
    const booking = await FlightBookingDAO.getBookingByID(newFlight.name);
    return res.status(200).json({
      code: 200,
      msg: "Create new booking successfully!",
      data: { booking },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const id = req.params.id * 1;
    await FlightBookingDAO.deleteBookingById(id);
    return res.status(200).json({
      code: 200,
      msg: `Delete booking with ${id} successfully!`,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const id = req.params.id * 1;
    const updateInfo = req.body;
    await FlightBookingDAO.updateBookingById(id, updateInfo);
    const flight = await FlightBookingDAO.getBookingByID(id);
    return res.status(200).json({
      code: 200,
      msg: `Update booking id: ${id} successfully!`,
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
