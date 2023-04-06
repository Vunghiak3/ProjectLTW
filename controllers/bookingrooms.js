const BookingRoomDAO = require("./../DAO/BookingRoomDAO");

exports.getAllBookingRoomsHandler = async (req, res) => {
  try {
    const { page, pageSize, totalPage, totalItem, bookingrooms } =
      await BookingRoomDAO.getAllBookingRoom(req.query);
    return res.status(200).json({
      code: 200,
      msg: "OK",
      page,
      pageSize,
      totalPage,
      totalItem,
      data: {
        bookingrooms,
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

exports.createBookingRoomHandler = async (req, res) => {
  console.log(req.body);
  const newBookingRoom = req.body;
  try {
    await BookingRoomDAO.createBookRoom(newBookingRoom);
    await BookingRoomDAO.totalPriceRoom(
      newBookingRoom.roomid,
      newBookingRoom.numberday
    );
    const bookingroom = await BookingRoomDAO.getBookingRoomByCreateAt(
      newBookingRoom.createAt
    );
    let result = {
      code: 200,
      msg: "Create new booking room successfully!",
      data: {
        bookingroom,
      },
    };
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

exports.deleteBookingRoomHandler = async (req, res) => {
  try {
    const id = req.params.id * 1;
    await BookingRoomDAO.deleteBookRoom(id);
    return res.status(200).json({
      code: 200,
      msg: `Delete booking room with ${id} successfully!`,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

exports.updateBookingRoomHandler = async (req, res) => {
  try {
    console.log(req.params.id);
    console.log(req.body);
    const id = req.params.id * 1;
    const updateInfo = req.body;
    await BookingRoomDAO.updateBookRoom(id, updateInfo);
    const bookRoom = await BookingRoomDAO.getBookRoomById(id);
    return res.status(200).json({
      code: 200,
      msg: `Update booking room with id: ${id} successfully!`,
      data: {
        bookRoom,
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

exports.getBookRoomHandler = async (req, res) => {
  try {
    const bookroom = req.bookroom;
    let result = {
      code: 200,
      msg: "OK",
      data: {
        bookroom,
      },
    };
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

exports.checkHotelById = async (req, res, next, val) => {
  try {
    const id = val;
    let bookroom = await BookingRoomDAO.getBookRoomById(id);
    if (!bookroom) {
      return res.status(404).json({
        code: 404,
        msg: `Not found hotel with id ${id}`,
      });
    }
    req.bookroom = bookroom;
  } catch (e) {
    return res
      .status(500) // 500 - Internal Error
      .json({
        code: 500,
        msg: e.toString(),
      });
  }
  next();
};
