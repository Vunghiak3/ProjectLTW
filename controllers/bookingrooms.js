const BookingRoomDAO = require("./../DAO/BookingRoomDAO");
const jwt = require("jsonwebtoken");

exports.getAllBookingRoomsHandler = async (req, res) => {
  try {
    const { page, pageSize, totalPage, totalItem, bookingrooms } =
      await BookingRoomDAO.getAllBookRoom(req.query);
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

//Booking rooms
exports.bookRoomHandler = async (req, res) => {
  const info = req.body;
  let token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decodedToken.id;
  info.userid = userId;
  try {
    await BookingRoomDAO.createBookroom(info);
    const bookingroom = await BookingRoomDAO.getBookingRoomByCreateAt(
      info.createAt
    );
    let result = {
      code: 200,
      msg: "Booking Successful!",
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

exports.cancelRoomHandler = async (req, res) => {
  try {
    const id = req.params.id * 1;
    req.body.status = "cancelled";
    const updateInfo = req.body;
    let bookRoom = await BookingRoomDAO.getBookRoomById(id);
    if (bookRoom.Status === "pending") {
      await BookingRoomDAO.updateBookRoom(id, updateInfo);
      bookRoom = await BookingRoomDAO.getBookRoomById(id);
      return res.status(200).json({
        code: 200,
        msg: `Successful cancellation!`,
        data: {
          bookRoom,
        },
      });
    } else {
      throw new Error("Can not cancel the room!");
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

exports.getAllBookingRoomsOfUserLoginHandler = async (req, res) => {
  let token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decodedToken.id;
  req.query.userid = userId;
  try {
    const { page, pageSize, totalPage, totalItem, bookingrooms } =
      await BookingRoomDAO.getAllBookRoom(req.query);
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
