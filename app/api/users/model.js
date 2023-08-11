const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Must Provide Username"],
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Must Provide Email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Must Provide Password"],
      minlength: 8,
    },
    no_telpon: {
      type: String,
      required: [true, "Must Provide No Telpon"],
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    avatar: {
      type: String,
      default: "default.png",
    },
  },
  { timestamps: true }
);

UserSchema.path("email").validate(
  function (value) {
    const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return EMAIL_RE.test(value);
  },
  (attr) => `${attr.value} harus merupakan email yang valid!`
);

UserSchema.pre("save", async function () {
    // console.log(this.modifiedPaths());
    // console.log(this.isModified('name'));
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
  });
  
  UserSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch;
  };
  
  module.exports = mongoose.model("User", UserSchema);