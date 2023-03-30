const RoomSchema = require("../Model/Room");
const HotelDAO = require("./../DAO/HotelDAO");
const RoomDAO = require("./../DAO/RoomDAO");

exports.getAllHotelsHandler = async (req, res) => {
  try {
    const { page, pageSize, totalPage, totalItem, hotels } =
      await HotelDAO.getAllHotel(req.query);
    return res.status(200).json({
      code: 200,
      msg: "OK",
      page,
      pageSize,
      totalPage,
      totalItem,
      data: {
        hotels,
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

exports.createHotelHandler = async (req, res) => {
  const newHotel = req.body;
  try {
    await HotelDAO.createNewHotel(newHotel);
    // const hotel = await HotelDAO.getHotelByname(newHotel.name);
    const hotel = await HotelDAO.getHotelByCreateAt(newHotel.createAt)

    let result = {
      code: 200,
      msg: "Create new hotel successfully!",
      data: {
        hotel,
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

exports.checkHotelById = async (req, res, next, val) => {
  try {
    const id = val;
    let hotel = await HotelDAO.getHotelById(id);
    if (!hotel) {
      return res.status(404).json({
        code: 404,
        msg: `Not found hotel with id ${id}`,
      });
    }
    req.hotel = hotel;
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

exports.getHotelHandler = async (req, res) => {
  try {
    const hotel = req.hotel;

    let result = {
      code: 200,
      msg: "OK",
      data: { hotel },
    };
    res.status(200).json(result);
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

exports.deleteHotelHandler = async (req, res) => {
  try {
    const id = req.params.id * 1;
    await RoomDAO.deleteRoomByHotelId(id);
    await HotelDAO.deleteHotelById(id);
    return res.status(200).json({
      code: 200,
      msg: `Delete hotel with ${id} successfully!`,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

exports.updateHotelHandler = async (req, res) => {
  try {
    const id = req.params.id * 1;
    const updateInfo = req.body;
    await HotelDAO.updateHotelById(id, updateInfo);
    const hotel = await HotelDAO.getHotelById(id);
    return res.status(200).json({
      code: 200,
      msg: `Update hotel with id: ${id} successfully!`,
      data: {
        hotel,
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
