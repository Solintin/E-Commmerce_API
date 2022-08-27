const { default: mongoose } = require("mongoose");
const Mongoose = require("mongoose");
var validator = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: ["Please provide a name"],
    validate: {
      message: "Please provide a valid email address",
      validator: validator.isEmail,
    },
    unique: true,
  },
  name: {
    type: String,
    required: ["Please provide a name"],
  },
  password: {
    type: String,
    required: ["Please provide a name"],
    minlength: 6,
  },
  role: {
    type: String,
    required: ["Please provide a role"],
    enum: ["admin", "user"],
    default: "user",
  },
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
