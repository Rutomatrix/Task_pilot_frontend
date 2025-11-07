import React, { useState } from "react";
import { Send } from "lucide-react";

const Chat = () => {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello 👋! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    // Mock AI reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Got it! I'll process that for you. 🚀" },
      ]);
    }, 700);
  };

  return (
    <div className="flex flex-col h-full p-6 bg-[#f2f7fa]">
      {/* Chat Header */}
      <div className="bg-white shadow rounded-xl p-4 mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Chat</h2>
        <span className="text-gray-500 text-sm">ChatGPT-style Interface</span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow p-4 space-y-4 mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                msg.sender === "user"
                  ? "bg-[#28abe2] text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex items-center gap-3 bg-white shadow rounded-xl p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#28abe2]"
        />
        <button
          onClick={handleSend}
          className="flex items-center justify-center gap-2 bg-[#28abe2] hover:bg-[#219fd3] text-white px-4 py-2 rounded-xl font-medium transition"
        >
          <Send size={18} />
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
