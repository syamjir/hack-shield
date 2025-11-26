"use client";

import { useState, useEffect, useRef } from "react";
import { useChatSocket } from "@/hooks/useChatSocket";
import { getMessagesByRoomId } from "@/server_actions/messageServerActions";

export default function Chat({ roomId, sender, reciever }: any) {
  const {
    messages,
    setMessages,
    sendMessage,
    sendTyping,
    markRead,
    online,
    typing,
    typingUser,
  } = useChatSocket(roomId);

  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  /** Load initial messages */
  useEffect(() => {
    const fetchMessages = async () => {
      const data = await getMessagesByRoomId(roomId);
      setMessages(data.data);
      scrollToBottom();
    };
    fetchMessages();
  }, []);

  /** Auto scroll when new msgs arrive */
  useEffect(() => {
    if (!messages.length) return;

    const hasUnread = messages.some((m) => m.sender !== sender && !m.read);

    if (hasUnread) markRead();

    if (autoScroll) scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  };

  const handleScroll = () => {
    const div = scrollRef.current;
    if (!div) return;
    const atBottom = div.scrollTop + div.clientHeight >= div.scrollHeight - 30;
    setAutoScroll(atBottom);
  };

  /** Date formatting */
  const formatDateLabel = (date: string) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isNewDay = (msg: any, i: number) => {
    if (i === 0) return true;
    return (
      new Date(messages[i - 1].createdAt).toDateString() !==
      new Date(msg.createdAt).toDateString()
    );
  };

  return (
    <div
      className="
      flex flex-col 
      w-full h-[80vh] 
      bg-[#1A1D1F] 
      rounded-xl 
      border border-[#2F3236]
      p-4 
      text-white 
      max-w-3xl   /* perfect center size for desktop */
      mx-auto
    "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Chat - {reciever}</h3>
        <span
          className={`text-xs ${online ? "text-[#5BE17C]" : "text-red-400"}`}
        >
          {online ? "● Online" : "● Offline"}
        </span>
      </div>

      {/* MESSAGE LIST */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="
        bg-surface-a0/30
        p-4
        rounded-2xl
          flex-1 
          overflow-y-auto 
          space-y-4 
          pr-2 
          custom-scroll
        "
      >
        {messages.map((msg: any, i: number) => (
          <div key={i}>
            {/* DATE SEPARATOR */}
            {isNewDay(msg, i) && (
              <div className="text-center my-2 text-xs text-gray-400">
                {formatDateLabel(msg.createdAt)}
              </div>
            )}

            {/* MESSAGE BUBBLE */}
            <div
              className={`max-w-[80%] p-3 rounded-xl text-sm ${
                msg.sender === sender
                  ? "ml-auto bg-info-a10 text-white"
                  : "bg-[#2A2D31] border border-[#3A3D41]"
              }`}
            >
              {msg.text}
              <div className="text-[10px] mt-1 opacity-70">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              {msg.sender === sender && (
                <p className="text-[10px] opacity-70 mt-1 text-right">
                  {msg.read ? "✓✓ Read" : "✓ Sent"}
                </p>
              )}
            </div>
          </div>
        ))}

        {/* typing */}
        {typing && typingUser !== sender && (
          <p className="text-xs text-gray-400">Typing...</p>
        )}
      </div>

      {/* SCROLL DOWN BUTTON */}
      {!autoScroll && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-35 right-10  px-3 py-1 text-xs rounded-md bg-info-a10 text-white shadow-md"
        >
          ↓ New Messages
        </button>
      )}

      {/* INPUT */}
      <div className="mt-4 flex gap-3">
        <input
          className="flex-1 p-2 rounded-lg bg-[#2A2D31] border border-[#3A3D41] text-white"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            sendTyping(true, sender);
            setTimeout(() => sendTyping(false, sender), 1000);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (!text.trim()) return;
              sendMessage(text, sender);
              setText("");
              scrollToBottom();
            }
          }}
        />
        <button
          onClick={() => {
            if (!text.trim()) return;
            sendMessage(text, sender);
            setText("");
            scrollToBottom();
          }}
          className="px-4 py-2 bg-info-a10 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
