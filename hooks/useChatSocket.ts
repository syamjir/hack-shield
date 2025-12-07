"use client";

import { IMessage } from "@/models/Message";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export function useChatSocket(roomId: string) {
  const socketRef = useRef<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [online, setOnline] = useState(false);
  const [isPairOnline, setIsPairOnline] = useState(false);
  const [typing, setTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<"user" | "admin" | null>(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const pathname = usePathname();

  useEffect(() => {
    socketRef.current = io("http://localhost:4000", {
      transports: ["websocket", "polling"],
    });

    // io() ->Create Socket.IO client instance
    // The path option tells the client where the Socket.IO server is listening.
    // Server: http://localhost:3000/api/socket  <-- Socket.IO server endpoint
    //socketRef.current = {
    //   "id": "dajh3hda9s",
    //   "connected": true,
    //   "emit": [Function],
    //   "on": [Function]
    // } instance of socket.io client

    socketRef.current.on("connect_error", (err) =>
      console.error("WS Error:", err)
    );

    socketRef.current.emit("join_room", roomId);
    socketRef.current.emit("online-users");

    socketRef.current.on("online-users", (data) => {
      setOnlineUsers(data);
    });

    socketRef.current.on("receive_message", (msg: IMessage) =>
      setMessages((prev) => [...prev, msg])
    );
    socketRef.current.on("message_history", (msgs: IMessage[]) =>
      setMessages(msgs)
    );

    socketRef.current.on(
      "online_status",
      (data: { userId: string; online: boolean; pairOnline: boolean }) => {
        setOnline(data.online);
        setIsPairOnline(data.pairOnline);
      }
    );

    socketRef.current.on(
      "typing",
      (data: { isTyping: boolean; sender: "user" | "admin" }) => {
        setTyping(data.isTyping);
        setTypingUser(data.sender);
      }
    );

    socketRef.current.on("messages_read", () => {
      setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
    });

    return () => socketRef.current.disconnect();
  }, [roomId]);

  useEffect(() => {
    return () => {
      console.log("Component unmounted, disconnecting socket");
      socketRef.current?.disconnect();
    };
  }, [pathname]);

  const sendMessage = (text: string, sender: "admin" | "user") => {
    socketRef.current.emit("send_message", {
      room: roomId,
      text,
      sender,
    });
  };

  const sendTyping = (isTyping: boolean, sender: "admin" | "user") => {
    socketRef.current.emit(isTyping ? "typing" : "stop_typing", roomId, sender);
  };

  const markRead = () => {
    socketRef.current.emit("mark_read", roomId);
  };

  return {
    messages,
    setMessages,
    sendMessage,
    sendTyping,
    markRead,
    online,
    typing,
    typingUser,
    onlineUsers,
    isPairOnline,
  };
}
