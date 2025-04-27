import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const RoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRoomDetails();
  }, [roomId]);

  const fetchRoomDetails = async () => {
    try {
      const response = await axios.get(`/api/rooms/${roomId}/`, { withCredentials: true });
      setRoom(response.data);
    } catch (error) {
      console.error('Error fetching room details:', error);
      navigate('/dashboard');
    }
  };

  const handleLeaveRoom = () => {
    navigate('/dashboard');
  };

  const handleSendMessage = () => {
    console.log('Send message:', message);
    setMessage(""); // Clear input after sending
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
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-muted">
        <h1 className="text-xl font-semibold">{room.name}</h1>
        <Button variant="destructive" onClick={handleLeaveRoom}>
          Leave Room
        </Button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
        <div className="flex flex-col items-center text-muted-foreground">
          <span>Start chatting or initiate a video call!</span>
        </div>
        {/* Messages will come here later */}
      </div>

      <Separator />

      {/* Input Area */}
      <div className="flex items-center p-4 bg-background gap-2">
        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </div>
    </div>
  );
};

export default RoomPage;
