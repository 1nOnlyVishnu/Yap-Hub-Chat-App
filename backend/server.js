const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/message", messageRoutes);

//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Deployment Code ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const __dirName1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirName1, "/frontend/build")));
  app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    if (req.method === "GET") {
      return res.sendFile(
        path.join(__dirName1, "frontend", "build", "index.html")
      );
    }
    next();
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}
//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Deployment Code ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:3000", "https://yap-hub-chat-app.onrender.com/"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    const chat = newMessageRecieved.chat;

    if (!chat) {
      console.log("chat not defined");
      return;
    }

    if (!chat.users) {
      console.log("chat.users not defined");
      return;
    }

    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message received", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("user disconnected");
    socket.leave(userData._id);
  });
});
