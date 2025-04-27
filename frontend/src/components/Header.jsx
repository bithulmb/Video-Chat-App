import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useNavigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow-md">
      {/* Website Name */}
      <div className="text-2xl font-bold text-primary">VideoConnect</div>

      {/* Avatar and Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage
            //   src={
            //     user?.profile_image || "https://ui-avatars.com/api/?name=User"
            //   }
              alt="User"
            />
            <AvatarFallback>
            {`${user.first_name[0]} ${user.last_name[0]}`}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem
            onClick={handleLogout}
            className="hover:bg-red-100 dark:hover:bg-red-400/20 cursor-pointer"
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Header;
