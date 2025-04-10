const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createGuestUser = async () => {
  try {
    const existing = await User.findOne({ email: "guest@example.com" });
    if (existing) {
      console.log("Guest user already exists.");
    } else {
      const guest = await User.create({
        name: "Guest User",
        email: "guest@example.com",
        password: bcrypt.hashSync("123456", 10),
      });
      console.log("Guest user created:", guest);
    }
    process.exit();
  } catch (err) {
    console.error("Error creating guest user:", err);
    process.exit(1);
  }
};

createGuestUser();
