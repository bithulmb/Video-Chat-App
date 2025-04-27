import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import api from "@/axios/api"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuth from "@/components/hooks/useAuth";
import { toast } from "sonner";
import Header from "@/components/Header";

const DashboardPage = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const navigate = useNavigate();

  const { user, logout } = useAuth()

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await api.get("/api/rooms/"); 
      setRooms(response.data);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;
    try {
      const response = await api.post("/api/rooms/", { name: newRoomName });
      setNewRoomName("");
      fetchRooms(); 
      navigate(`/rooms/${response.data.id}`); 
      toast.success("Room created succesfully")
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  const handleJoinRoom = (room) => {
    navigate(`/rooms/${room.id}`);
    toast.success(`${room.name} joined succesfully`)
  };



  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">

     
      <Header/>
      

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* Create Room */}
          <section>
            <h2 className="text-3xl font-bold mb-4">Create a New Room</h2>
            <div className="flex items-center space-x-4">
              <Input
                placeholder="Enter room name..."
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />
              <Button onClick={handleCreateRoom}>Create Room</Button>
            </div>
          </section>

          {/* Available Rooms */}
          <section>
            <h2 className="text-3xl font-bold mb-4">Available Rooms</h2>
            {rooms.length === 0 ? (
              <p className="text-gray-500">No rooms available yet. Create one!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <div key={room.id} className="p-6 bg-white dark:bg-gray-800 rounded shadow hover:shadow-lg transition">
                    <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                    <Button
                      variant="outline"
                      onClick={() => handleJoinRoom(room)}
                    >
                      Join Room
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
