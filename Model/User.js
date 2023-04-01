const ModelSchema = require("./ModelSchema");
const ModelSchemaValidator = require("./ModelSchemaValidator");
const sql = require("mssql");
const StaticData = require("./../utils/StaticData");

const UserSchema = new ModelSchema(
  {
    id: new ModelSchemaValidator({
      name: "Id",
      sqlType: sql.Int,
    }),
    username: new ModelSchemaValidator({
      name: "Username",
      sqlType: sql.VarChar,
      require: true,
    }),
    password: new ModelSchemaValidator({
      name: "Password",
      sqlType: sql.VarChar,
      require: true,
      validator: function (val) {
        return val.length > 5 && val.length < 200;
      },
    }),
    passwordAt: new ModelSchemaValidator({
      name: "PasswordAt",
      sqlType: sql.DateTime,
      require: true,
    }),
    name: new ModelSchemaValidator({
      name: "Name",
      sqlType: sql.NVarChar,
      require: true,
    }),
    email: new ModelSchemaValidator({
      name: "Email",
      sqlType: sql.VarChar,
      require: true,
      validator: function (val) {
        return String(val)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      },
    }),
    phonenumber: new ModelSchemaValidator({
      name: "PhoneNumber",
      sqlType: sql.NVarChar,
      require: true,
    }),
    birthday: new ModelSchemaValidator({
      name: "Birthday",
      sqlType: sql.Date,
      require: true,
    }),
    roleid: new ModelSchemaValidator({
      name: "RoleId",
      sqlType: sql.Int,
      default: StaticData.AUTH.Role.user,
      require: true,
    }),
    createAt: new ModelSchemaValidator({
      name: "CreateAt",
      sqlType: sql.DateTime,
      require: true,
    }),
  },
  "USERS",
  "createAt"
);

module.exports = UserSchema;
