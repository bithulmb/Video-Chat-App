import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import api from "@/axios/api"; 
import { toast } from "sonner";
import Header from "@/components/Header";

const DashboardPage = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [open, setOpen] = useState(false); // Dialog open/close
  const navigate = useNavigate();

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
      setOpen(false); // Close the dialog
      navigate(`/rooms/${response.data.id}`); 
      toast.success("Room created successfully");
    } catch (error) {
      console.error("Failed to create room:", error);
      toast.error("Failed to create room");
    }
  };

  const handleJoinRoom = (room) => {
    navigate(`/rooms/${room.id}`);
    toast.success(`Joined room: ${room.name}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Header />

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* Create Room Button */}
          <section className="flex justify-end">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Create Room</Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create a New Room</DialogTitle>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                  <Input
                    placeholder="Enter room name..."
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                  />
                </div>

                <DialogFooter className="mt-6">
                  <Button type="button" onClick={handleCreateRoom}>
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
