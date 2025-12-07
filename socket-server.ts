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

  let onlineUsers: Record<string, number> = {};

  io.on("connection", (socket) => {
    console.log("🔥 Socket connected:", socket.id);
    let joinedRoom: string | null = null;
    // JOIN ROOM
    socket.on("join_room", async (roomId) => {
      joinedRoom = roomId;
      socket.join(roomId);
      // Increment count
      onlineUsers[roomId] = (onlineUsers[roomId] ?? 0) + 1;

      // Check if pair is online
      const isOnline = onlineUsers[roomId] >= 2;

      io.emit("online-users", Object.keys(onlineUsers));
      io.to(roomId).emit("online_status", {
        userId: roomId,
        online: true,
        pairOnline: isOnline,
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
      if (!joinedRoom) return;

      const roomId = joinedRoom;

      onlineUsers[roomId] = Math.max((onlineUsers[roomId] ?? 1) - 1, 0);

      const isOnline = onlineUsers[roomId] > 0;
      const pairOnline = onlineUsers[roomId] >= 2;

      io.to(roomId).emit("online_status", {
        userId: roomId,
        online: isOnline,
        pairOnline,
      });

      if (onlineUsers[roomId] === 0) {
        delete onlineUsers[roomId];
      }

      io.emit("online-users", Object.keys(onlineUsers));
    });
  });

  console.log("🚀 Socket Server running on port 4000");
}

// START SERVER
start();
