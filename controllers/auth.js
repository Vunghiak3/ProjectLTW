const UserDAO = require("./../DAO/UserDAO");
const StaticData = require("./../utils/StaticData");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signToken = (id, username) => {
  return jwt.sign(
    {
      id: id,
      username: username,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRED_IN }
  );
};

exports.login = async (req, res) => {
  try {
    const form = req.body;
    if (!form.password || !form.username) {
      return res.status(403).json({
        code: 403,
        msg: "Invalid params",
      });
    }

    const user = await UserDAO.getUserByUserName(form.username);
    if (!user) {
      return res.status(401).json({
        code: 401,
        msg: `Invalid user - ${form.username}`,
      });
    }

    const isValidPassword = await bcrypt.compare(form.password, user.Password);
    if (!isValidPassword) {
      return res.status(401).json({
        code: 401,

        msg: "Invalid authentication!",
      });
    }

    const token = signToken(user.Id, user.Username);
    res.status(200).json({
      code: 200,
      msg: "OK",
      data: {
        token,
      },
    });
  } catch (e) {
    console.error(e);
    res
      .status(500) // 401 - Unauthorized
      .json({
        code: 500,
        msg: e.toString(),
      });
  }
};

exports.signup = async (req, res) => {
  try {
    const form = req.body;
    if (form.password !== form.repeatPassword) {
      return res.status(403).json({
        code: 403,
        msg: "Invalid password!",
      });
    }
    await UserDAO.addUser({
      username: form.username,
      password: form.password,
      name: form.name,
      email: form.email,
      phonenumber: form.phonenumber,
      birthday: form.birthday,
      roleid: StaticData.AUTH.Role.user,
    });
      console.log("🚀 ~ file: auth.js:81 ~ exports.signup= ~ StaticData.AUTH.Role.user:", StaticData.AUTH.Role.user)
    const user = await UserDAO.getUserByUserName(form.username);
    delete user.password;
    delete user.passwordAt;
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (e) {
    console.error(e);
    res
      .status(500) // 401 - Unauthorized
      .json({
        code: 500,
        msg: e.toString(),
      });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        code: 401,
        msg: "Your are not logged in! Please log in to gert access.",
      });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await UserDAO.getUser(payload.id);
    if (!currentUser) {
      return res.status(401).json({
        code: 401,
        msg: "Invalid authenication!",
      });
    }
    req.user = currentUser;
  } catch (e) {
    console.error(e);
    res
      .status(500) // 401 - Unauthorized
      .json({
        code: 500,
        msg: e.toString(),
      });
  }
  next();
};

exports.restricTo = (...roles) => {
  return async (req, res, next) => {
    console.log("🚀 ~ file: auth.js:140 ~ return ~ req:", req)
    if (!roles.includes(req.user.RoleId)) {
      return res.status(403).json({
        code: 401,
        msg: "Your do not have permission to perform this action!",
      });
    }
    next();
  };
};
