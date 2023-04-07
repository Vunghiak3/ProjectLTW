const FlightDAO = require("./../DAO/FlightsDAO");
const AirPortDAO = require("./../DAO/AirPortDAO");
//CRUD OPERATION
exports.getAllAirPort = async (req, res) => {
  try {
    const { page, pageSize, totalPage, totalItem, airPorts } =
      await AirPortDAO.getAllAirPort(req.query);
    return res.status(200).json({
      code: 200,
      msg: "OK",
      page,
      pageSize,
      totalPage,
      totalItem,
      data: {
        airPorts,
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
exports.getAirPortById = async (req, res, next) => {
  const id = req.params.id;
  try {
    let airPort = await AirPortDAO.getAirPortByID(id);
    if (!airPort) {
      return res.status(404).json({
        code: 404,
        msg: `AirPort not existed`,
      });
    } else {
      res.status(200).json({
        code: 200,
        msg: `OK`,
        data: {
          airPort,
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

exports.createAirPort = async (req, res) => {
  const newAirPort = req.body;
  try {
    await AirPortDAO.createAirPort(newAirPort);
    const airPort = await AirPortDAO.getAirPortByCreateAt(newAirPort.createAt);
    return res.status(200).json({
      code: 200,
      msg: "Create new flight successfully!",
      data: { airPort },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

exports.deleteAirPort = async (req, res) => {
  try {
    const id = req.params.id * 1;
    await FlightDAO.deleteFlightById(id);
    await AirPortDAO.deleteAirPortById(id);
    return res.status(200).json({
      code: 200,
      msg: `Delete Air Port with ${id} successfully!`,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
}; // test when delete flight complete

exports.updateAirPort = async (req, res) => {
  try {
    const id = req.params.id * 1;
    const updateInfo = req.body;
    await AirPortDAO.updateAirPortById(id, updateInfo);
    const airPort = await AirPortDAO.getAirPortByID(id);
    return res.status(200).json({
      code: 200,
      msg: `Update air port with id: ${id} successfully!`,
      data: {
        airPort,
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
