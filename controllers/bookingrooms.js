const BookingRoomDAO = require("./../DAO/BookingRoomDAO");

exports.getAllBookingRooms = async (req, res) => {
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

exports.findRoom = async (req, res) => {
  console.log(req.query);
};

exports.createBookingRoom = async (req, res) => {
  console.log(req.body);
  const newBookingRoom = req.body;
  try {
    await BookingRoomDAO.createNewBookingRoom(newBookingRoom);
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
