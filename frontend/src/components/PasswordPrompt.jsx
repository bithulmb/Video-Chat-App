import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/axios/api"; 
import { toast } from "sonner";


// Zod Schema for Password Prompt
const passwordSchema = z.object({
    password: z.string().min(1, "Password is required"),
  });


const PasswordPrompt = ({ room, onSuccess, onCancel }) => {
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm({
      resolver: zodResolver(passwordSchema),
      defaultValues: {
        password: "",
      },
    });
  
    const onSubmit = async (data) => {
      try {
        const response = await api.post(`/api/rooms/${room.id}/verify-password/`, {
          password: data.password,
        });
        if (response.status === 200) {
          onSuccess();
          toast.success(`Access granted to room: ${room.name}`);
        }
      } catch (error) {
        console.error("Failed to verify password:", error);
        toast.error(error.response?.data?.error || "Incorrect password");
      }
    };
  
    return (
      <Dialog open={true} onOpenChange={onCancel}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Enter Password for {room.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">This is a private room. Please enter the password to join.</p>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Verifying..." : "Submit"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  export default PasswordPrompt