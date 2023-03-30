const RoomDAO = require("./../DAO/RoomDAO");

exports.getAllRoomsHandler = async (req, res) => {
  try {
    const rooms = await RoomDAO.getAllRooms(req.query);
    return res.status(200).json({
      code: 200,
      msg: "OK",
      data: {
        rooms,
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

exports.checkRoomsById = async (req, res, next, val) => {
  try {
    const id = val;
    let room = await RoomDAO.getRoomById(id);
    if (!room) {
      return res.status(404).json({
        code: 404,
        msg: `Not found room with id ${id}`,
      });
    }
    req.room = room;
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
  next();
};

exports.getRoomHandler = async (req, res) => {
  try {
    const room = req.room;
    let result = {
      code: 200,
      msg: "OK",
      data: { room },
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

exports.createRoomHandler = async (req, res) => {
  const newRoom = req.body;
  try {
    await RoomDAO.createNewRoom(newRoom);
    const room = await RoomDAO.getRoomByName(newRoom.name);
    let result = {
      code: 200,
      msg: "Create new hotel successfully!",
      data: {
        room,
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

exports.deleteRoomHandler = async (req, res) => {
  try {
    const id = req.params.id * 1;
    await RoomDAO.deleteRoomById(id);
    return res.status(200).json({
      code: 200,
      msg: `Delete room with ${id} successfully!`,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

exports.updateRoomHandler = async (req, res) => {
  try {
    const id = req.params.id * 1;
    const updateInfo = req.body;
    await RoomDAO.updateRoomById(id, updateInfo);
    const room = await RoomDAO.getRoomById(id);
    return res.status(200).json({
      code: 200,
      msg: `Update room with id: ${id} successfully!`,
      data: {
        room,
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
