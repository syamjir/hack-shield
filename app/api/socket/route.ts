// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

// import { Server as SocketIOServer } from "socket.io";
// import Message from "@/models/Message";
// import { connectToMongo } from "@/lib/connectToMongo";

// const globalAny: any = global;

// // Online users list
// let onlineUsers: Record<string, string> = {};

// export async function GET() {
//   console.log("socket route");
//   await connectToMongo();
//   if (!globalAny.io) {
//     console.log("not globally.io");
//     const io = new SocketIOServer({
//       path: "/api/socket", // URL path where the Socket.IO server will listen for WebSocket connections.
//       cors: { origin: "*" },
//     });

//     globalAny.io = io;

//     io.on("connection", (socket) => {
//       console.log("🔥 User connected:", socket.id);

//       socket.on("join_room", (roomId) => {
//         socket.join(roomId);
//         onlineUsers[socket.id] = roomId;

//         io.to(roomId).emit("online_status", { userId: roomId, online: true });
//       });

//       // MESSAGE SEND & DB SAVE
//       socket.on("send_message", async (msg) => {
//         const saved = await Message.create({
//           room: msg.room,
//           text: msg.text,
//           sender: msg.sender,
//         });

//         io.to(msg.room).emit("receive_message", saved);
//       });

//       // TYPING INDICATOR
//       socket.on("typing", (roomId) => {
//         io.to(roomId).emit("typing", true);
//       });
//       socket.on("stop_typing", (roomId) => {
//         io.to(roomId).emit("typing", false);
//       });

//       // READ RECEIPT
//       socket.on("mark_read", async (roomId) => {
//         await Message.updateMany({ room: roomId, read: false }, { read: true });
//         io.to(roomId).emit("messages_read");
//       });

//       // DISCONNECT
//       socket.on("disconnect", () => {
//         const roomId = onlineUsers[socket.id];
//         delete onlineUsers[socket.id];

//         if (roomId) {
//           io.to(roomId).emit("online_status", {
//             userId: roomId,
//             online: false,
//           });
//         }

//         console.log("❌ User disconnected:", socket.id);
//       });
//     });
//   }

//   return new Response("WebSocket running");
// }
