import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import api from "@/axios/api";
import { toast } from "sonner";
import Header from "@/components/Header";
import RoomCreationForm from "@/components/RoomCreationForm";
import { Lock } from "lucide-react";
import PasswordPrompt from "@/components/PasswordPrompt";

const DashboardPage = () => {
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);
  const [passwordPromptRoom, setPasswordPromptRoom] = useState(null);
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

  const handleCreateRoom = (room) => {
    setRooms((prev) => [room, ...prev]);
    setOpen(false);
    navigate(`/rooms/${room.id}`);
  };

  const handleJoinRoom = (room) => {
    if (room.is_private) {
      setPasswordPromptRoom(room);
    } else {
      navigate(`/rooms/${room.id}`);
      toast.success(`Joined room: ${room.name}`);
    }
  };

  const handlePasswordSuccess = () => {
    if (passwordPromptRoom) {
      navigate(`/rooms/${passwordPromptRoom.id}`);
      toast.success(`Joined room: ${passwordPromptRoom.name}`);
      setPasswordPromptRoom(null);
    }
  };

  const handlePasswordCancel = () => {
    setPasswordPromptRoom(null);
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
                <RoomCreationForm
                  onCreate={handleCreateRoom}
                  onCancel={() => setOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </section>

          {/* Available Rooms */}
          <section>
            <h2 className="text-3xl font-bold mb-4">Available Rooms</h2>
            {rooms.length === 0 ? (
              <p className="text-gray-500">
                No rooms available yet. Create one!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="p-6 bg-white dark:bg-gray-800 rounded shadow hover:shadow-lg transition"
                  >
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold">{room.name}</h3>

                      {room.is_private && (
                        <Lock className="ml-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm dark:text-gray-300 mb-4">
                      {room.description }
                    </p>
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
      {/* Password Prompt Dialog */}
      {passwordPromptRoom && (
        <PasswordPrompt
          room={passwordPromptRoom}
          onSuccess={handlePasswordSuccess}
          onCancel={handlePasswordCancel}
        />
      )}
    </div>
  );
};

export default DashboardPage;
