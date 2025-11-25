import * as dotenv from "dotenv";
import { resolve } from "path";

// Load your .env.local file manually
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { Server } from "socket.io";
import Message from "./models/Message.js";
import { connectToMongo } from "./lib/connectToMongo.js";

// -------------------------------------------------
// 1️⃣ CONNECT TO MONGO ONE TIME BEFORE STARTING SERVER
// -------------------------------------------------
async function start() {
  try {
    await connectToMongo();
    console.log("✅ MongoDB Connected for Socket Server");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }

  // -------------------------------------------------
  // 2️⃣ START SOCKET SERVER
  // -------------------------------------------------
  const io = new Server(4000, {
    cors: { origin: "*" },
  });

  let onlineUsers: Record<string, string> = {};

  io.on("connection", (socket) => {
    console.log("🔥 Socket connected:", socket.id);

    // JOIN ROOM
    socket.on("join_room", async (roomId) => {
      socket.join(roomId);
      onlineUsers[socket.id] = roomId;

      io.to(roomId).emit("online_status", {
        userId: roomId,
        online: true,
      });

      const messages = await Message.find({ room: roomId })
        .sort({
          createdAt: 1,
        })
        .lean();

      socket.emit("message_history", messages);

      console.log(`📌 Joined room: ${roomId}`);
    });

    // SEND MESSAGE + SAVE TO DB
    socket.on("send_message", async (msg) => {
      try {
        const saved = await Message.create({
          room: msg.room,
          text: msg.text,
          sender: msg.sender,
        });

        io.to(msg.room).emit("receive_message", saved);
      } catch (err) {
        console.error("❌ Message save failed:", err);
      }
    });

    // TYPING EVENTS
    socket.on("typing", (roomId, sender) => {
      io.to(roomId).emit("typing", { isTyping: true, sender });
    });

    socket.on("stop_typing", (roomId, sender) => {
      io.to(roomId).emit("typing", { isTyping: false, sender });
    });

    // MARK READ (called by client when user sees messages)
    socket.on("mark_read", async (roomId) => {
      try {
        // Update unread messages
        await Message.updateMany({ room: roomId, read: false }, { read: true });
        io.to(roomId).emit("messages_read");
      } catch (err) {
        console.error("❌ mark_read error:", err);
      }
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      const roomId = onlineUsers[socket.id];
      delete onlineUsers[socket.id];

      if (roomId) {
        io.to(roomId).emit("online_status", {
          userId: roomId,
          online: false,
        });
      }

      console.log("❌ Socket disconnected:", socket.id);
    });
  });

  console.log("🚀 Socket Server running on port 4000");
}

// START SERVER
start();
