"use client";

import { IMessage } from "@/models/Message";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export function useChatSocket(roomId: string) {
  const socketRef = useRef<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [online, setOnline] = useState(false);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    socketRef.current = io("http://localhost:3000", { path: "/api/socket" }); // io() ->Create Socket.IO client instance
    // The path option tells the client where the Socket.IO server is listening.
    // Server: http://localhost:3000/api/socket  <-- Socket.IO server endpoint
    //socketRef.current = {
    //   "id": "dajh3hda9s",
    //   "connected": true,
    //   "emit": [Function],
    //   "on": [Function]
    // } instance of socket.io client

    socketRef.current.emit("join_room", roomId);

    socketRef.current.on("receive_message", (msg: IMessage) =>
      setMessages((prev) => [...prev, msg])
    );

    socketRef.current.on(
      "online_status",
      (data: { userId: string; online: boolean }) => setOnline(data.online)
    );

    socketRef.current.on("typing", (isTyping: boolean) => setTyping(isTyping));

    socketRef.current.on("messages_read", () => {
      setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
    });

    return () => socketRef.current.disconnect();
  }, [roomId]);

  const sendMessage = (text: string, sender: "admin" | "user") => {
    socketRef.current.emit("send_message", {
      room: roomId,
      text,
      sender,
    });
  };

  const sendTyping = (isTyping: boolean) => {
    socketRef.current.emit(isTyping ? "typing" : "stop_typing", roomId);
  };

  const markRead = () => {
    socketRef.current.emit("mark_read", roomId);
  };

  return {
    messages,
    sendMessage,
    sendTyping,
    markRead,
    online,
    typing,
  };
}
