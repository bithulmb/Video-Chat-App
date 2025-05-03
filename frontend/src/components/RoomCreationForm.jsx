import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/axios/api"; 
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";



// Zod Schema for Form Validation
const roomSchema = z.object({
    name: z.string().min(1, "Room name is required").max(20, "Room name must be 20 characters or less"),
    description: z.string().max(1000, "Description must be 1000 characters or less").optional(),
    is_private: z.boolean().default(false),
    password: z.string().optional(),
  }).refine(
    (data) => !data.is_private || (data.is_private && data.password && data.password.length >= 6),
    {
      message: "Password must be at least 6 characters for private rooms",
      path: ["password"],
    }
  );
  
  // Room Creation Form Component
  const RoomCreationForm = ({ onCreate, onCancel }) => {
    const {
      register,
      handleSubmit,
      watch,
      formState: { errors, isSubmitting },
    } = useForm({
      resolver: zodResolver(roomSchema),
      defaultValues: {
        name: "",
        description: "",
        is_private: false,
        password: "",
      },
    });
  
    const isPrivate = watch("is_private");
  
    const onSubmit = async (data) => {
      try {
        const payload = {
          name: data.name,
          description: data.description || "",
          is_private: data.is_private,
          ...(data.is_private && { password: data.password }),
        };
        const response = await api.post("/api/rooms/", payload);
        onCreate(response.data);
        toast.success("Room created successfully");
      } catch (error) {
        console.error("Failed to create room:", error);
        toast.error(error.response?.data?.password || "Failed to create room");
      }
    };
  
   
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Room Name
        </label>
        <Input
          id="name"
          type="text"
          {...register("name")}
          placeholder="Enter room name..."
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Enter room description..."
          className={errors.description ? "border-red-500" : ""}
          rows={4}
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
      </div>
      <div className="flex items-center">
        <input
          id="is_private"
          type="checkbox"
          {...register("is_private")}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="is_private" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Private Room
        </label>
      </div>
      {isPrivate && (
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder="Enter room password..."
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
        </div>
      )}
      <div className="flex justify-end space-x-2 mt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create"}
        </Button>
      </div>
    </form>
  );
  };
  
  export default RoomCreationForm