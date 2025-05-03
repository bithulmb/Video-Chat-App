import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import api from "@/axios/api";
import {
  ACCESS_TOKEN,
  WEB_SOCKET_URL,
  ZEGO_APP_ID,
} from "@/utils/constants/constants";
import useAuth from "@/components/hooks/useAuth";
import { format } from "date-fns";
import Header from "@/components/Header";
import { toast } from "sonner";

const RoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const [activeUsers, setActiveUsers] = useState(1);

  const { user } = useAuth();

  useEffect(() => {
    fetchRoomDetails();
  }, [roomId]);

  useEffect(() => {
    if (room) {
      connectWebSocket();
    }

    // Cleanup socket when component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [room]);

  const fetchRoomDetails = async () => {
    try {
      const response = await api.get(`/api/rooms/${roomId}/`);
      setRoom(response.data);

      const messagesResponse = await api.get(`/api/rooms/${roomId}/messages/`);
      setMessages(messagesResponse.data);
    } catch (error) {
      console.error("Error fetching room details:", error);
      navigate("/dashboard");
    }
  };

  const connectWebSocket = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    const wsUrl = `${WEB_SOCKET_URL}/ws/rooms/${roomId}/?token=${token}`;

    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log("WebSocket Connected ");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Message received from server:", data);

      if (data.type === "chat_message" && data.message) {
        setMessages((prev) => [...prev, data.message]);
      } else if (data.type === "user_count") {
        setActiveUsers(data.count);
      }
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket Disconnected ");
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };
  };

  const handleLeaveRoom = () => {
    navigate("/dashboard");
    toast.success(`Left from the ${room.name}`)
  };

  const handleSendMessage = () => {
    if (
      message.trim() !== "" &&
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN
    ) {
      socketRef.current.send(
        JSON.stringify({
          message: message,
        })
      );
      setMessage("");
    }
  };

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleJoinVideoCall = () => {
    navigate(`/video/${roomId}`);
  };

  if (!room) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span>Loading room...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header/>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-muted">
        <div>
          <h1 className="text-xl font-semibold">{room.name}</h1>
          <p className="text-sm text-muted-foreground">
            {activeUsers} user{activeUsers !== 1 ? "s" : ""} online
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline_default" onClick={handleJoinVideoCall}>
            Join Video Call
          </Button>
          <Button variant="destructive" onClick={handleLeaveRoom}>
            Leave Room
          </Button>
        </div>
      </div>
      {/* Chat Area */}
      
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 bg-background"
      >
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            const isOwnMessage = msg.username === user.username;
            const formattedTime = format(
              new Date(msg.timestamp),
              "dd/MM/yyyy hh:mm a"
            );

            return (
              <div
                key={index}
                className={`flex items-end ${
                  isOwnMessage ? "justify-end" : "justify-start"
                }`}
              >
                {!isOwnMessage && (               
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-xl font-semibold text-muted-foreground">
                      {msg.username?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}

                <div
                  className={`flex flex-col max-w-xs mx-2 ${
                    isOwnMessage ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      isOwnMessage
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {msg.username} • {formattedTime}
                  </div>
                </div>

                {isOwnMessage && (
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-sm font-semibold text-primary-foreground">
                      {msg.username?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center text-muted-foreground">
            <span>No messages yet. Start chatting!</span>
          </div>
        )}
      </div>

      <Separator />

      {/* Input Area */}
      <div className="flex items-center p-4 bg-background gap-2">
        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </div>
     
    </div>
  );
};

export default RoomPage;
