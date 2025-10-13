"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Spinner } from "@/components/ui/spinner";

interface Messages {
  role: string;
  content: string;
}

const AiChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Messages[]>([]);
  const [userMessage, setUserMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to toggle chatbot visibility
  const toggleChatBot = () => {
    setIsOpen(!isOpen);
  };

  // Function to handle user message and send it to AI
  const handleUserMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userMessage.trim()) return; // Prevent empty messages

    // Add the user's message to the state
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setUserMessage("");

    try {
      // Send a POST request to your API route for AI response
      setIsLoading(true);
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      // Add the AI's response to the state
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error interacting with AI:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I am having trouble... Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button to toggle the chatbot */}
      <Button
        onClick={toggleChatBot}
        className="fixed bottom-5 right-5 bg-dark-a0 dark:bg-light-a0 text-both-white-a0 p-3 rounded-full shadow-lg  transition duration-300 ring-1 ring-warning-a10 hover:ring-primary-a0 animate-ring-rotate"
        aria-label="Open AiChatBot"
      >
        Ai ✨
      </Button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 h-96 bg-surface-tonal-a10 dark:bg-surface-a30 rounded-lg shadow-xl overflow-hidden flex flex-col animate-slide-in">
          {/* Header with Close Button */}
          <div className="bg-primary-a0 text-both-white-a0 p-3 flex justify-between items-center">
            <span>AiChatBot</span>
            <Button
              onClick={toggleChatBot}
              variant="ghost"
              size={"icon-extra-sm"}
              className="text-xl font-semibold  dark:hover:bg-both-white-a0"
            >
              ✖
            </Button>
          </div>

          {/* Chat Body (messages display) */}
          <div
            ref={chatContainerRef}
            className="p-4 text-dark-a0 flex-grow overflow-y-auto"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 ${
                  msg.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    msg.role === "user"
                      ? "bg-surface-tonal-a20 dark:bg-surface-a50"
                      : "bg-surface-tonal-a30 dark:bg-surface-a40"
                  }`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && <Spinner className="size-6 text-surface-tonal-a50" />}
          </div>

          {/* User Input Form */}
          <form
            onSubmit={handleUserMessage}
            className="flex p-3 border-t items-center border-surface-a30 dark:border-surface-a40"
          >
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              className="w-full text-dark-a0 p-2 border rounded-md border-surface-a30 dark:border-surface-a40 focus:outline-none"
              placeholder="→ Ask AI something"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="ml-2 bg-primary-a20 hover:bg-primary-a10 text-both-white-a0 px-4 py-2 rounded-md"
            >
              Send
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default AiChatBot;
