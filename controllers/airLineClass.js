const ClassDAO = require("../DAO/AirLineClassDAO");
const SeatDAO = require("../DAO/SeatDAO");
const BookingDAO = require("../DAO/FlightBookingDAO");
const e = require("express");
exports.getAllClass = async (req, res) => {
  try {
    const { page, pageSize, totalPage, totalItem, classes } =
      await ClassDAO.getAllClass(req.query);
    return res.status(200).json({
      code: 200,
      msg: "OK",
      page,
      pageSize,
      totalPage,
      totalItem,
      data: {
        classes,
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

exports.createClass = async (req, res) => {
  const newClass = req.body;
  try {
    await ClassDAO.createClass(newClass);
    const classes = await ClassDAO.getClassByCreateAt(newClass.createAt);
    return res.status(200).json({
      code: 200,
      msg: "Create new class successfully!",
      data: { classes },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const id = req.params.id * 1;
    let seatCheck = await SeatDAO.checkingSeatsByClass(id);
    let bookingCheck = await BookingDAO.checkingBookingByClass(id);
    if (seatCheck == null && bookingCheck == null) {
      await BookingDAO.deleteByClassId(id);
      await SeatDAO.deleteByClassId(id);
      await ClassDAO.deleteClassById(id);
    } else if (seatCheck == null && bookingCheck != null) {
      await SeatDAO.deleteByClassId(id);
      await ClassDAO.deleteClassById(id);
    } else if (seatCheck != null && bookingCheck == null) {
      await BookingDAO.deleteByClassId(id);
      await ClassDAO.deleteClassById(id);
    } else {
      await ClassDAO.deleteClassById(id);
    }

    return res.status(200).json({
      code: 200,
      msg: `Delete class with ${id} successfully!`,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      msg: e.toString(),
    });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const id = req.params.id * 1;
    const updateInfo = req.body;
    await ClassDAO.updateClassById(id, updateInfo);
    const classes = await ClassDAO.getClassByID(id);
    return res.status(200).json({
      code: 200,
      msg: `Update class with id: ${id} successfully!`,
      data: {
        classes,
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
