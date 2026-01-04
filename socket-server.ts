import * as dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

// Core imports
import { Server } from "socket.io";
import Message from "./models/Message.js";
import { connectToMongo } from "./lib/connectToMongo.js";

// Start server after DB connection
async function start() {
  // Connect to MongoDB
  try {
    await connectToMongo();
    console.log("✅ MongoDB Connected for Socket Server");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }

  // Initialize Socket.IO server
  const io = new Server(4000, {
    cors: { origin: "*" },
  });

  // Track online users per room
  let onlineUsers: Record<string, number> = {};

  // Handle socket connections
  io.on("connection", (socket) => {
    console.log("🔥 Socket connected:", socket.id);
    let joinedRoom: string | null = null;

    // Join chat room
    socket.on("join_room", async (roomId) => {
      joinedRoom = roomId;
      socket.join(roomId);
      onlineUsers[roomId] = (onlineUsers[roomId] ?? 0) + 1;

      const isOnline = onlineUsers[roomId] >= 2;

      io.emit("online-users", Object.keys(onlineUsers));
      io.to(roomId).emit("online_status", {
        userId: roomId,
        online: true,
        pairOnline: isOnline,
      });

      const messages = await Message.find({ room: roomId })
        .sort({ createdAt: 1 })
        .lean();

      socket.emit("message_history", messages);
    });

    // Save and broadcast message
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

    // Typing indicators
    socket.on("typing", (roomId, sender) => {
      io.to(roomId).emit("typing", { isTyping: true, sender });
    });

    socket.on("stop_typing", (roomId, sender) => {
      io.to(roomId).emit("typing", { isTyping: false, sender });
    });

    // Mark messages as read
    socket.on("mark_read", async (roomId) => {
      try {
        await Message.updateMany(
          { room: roomId, read: false },
          { read: true }
        );
        io.to(roomId).emit("messages_read");
      } catch (err) {
        console.error("❌ mark_read error:", err);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      if (!joinedRoom) return;

      const roomId = joinedRoom;
      onlineUsers[roomId] = Math.max((onlineUsers[roomId] ?? 1) - 1, 0);

      io.to(roomId).emit("online_status", {
        userId: roomId,
        online: onlineUsers[roomId] > 0,
        pairOnline: onlineUsers[roomId] >= 2,
      });

      if (onlineUsers[roomId] === 0) delete onlineUsers[roomId];
      io.emit("online-users", Object.keys(onlineUsers));
    });
  });

  console.log("🚀 Socket Server running on port 4000");
}

// Start server
start();
