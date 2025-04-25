import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import api from "@/axios/api";
import { toast } from "sonner";
import { useNavigate } from "react-router";

// Zod validation schema
const userRegisterSchema = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Only letters and numbers allowed"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  first_name: z
    .string()
    .min(1, "First name is required")
    .regex(/^[a-zA-Z\s]+$/, "Only letters allowed"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .regex(/^[a-zA-Z\s]+$/, "Only letters allowed"),
});

const Register = () => {
  const form = useForm({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
    },
  });

  const navigate = useNavigate()

  const onSubmit = async (values) => {
    console.log(values)
    try{
      const response = await api.post('/api/register/',values)
      navigate('/login')
      toast.success("User registration succesful")
    }
    catch (error) {
      console.error(error);
    
      if (error.response?.status === 400 && error.response?.data) {
        const serverErrors = error.response.data;
    
        // Set form field errors
        Object.keys(serverErrors).forEach((field) => {
          if (form.getValues()[field] !== undefined) {
            form.setError(field, {
              type: "server",
              message: serverErrors[field][0], 
            });
          }
        });
      } else {
       
        const message =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Registration failed.";
        toast.error(message);
      }
    }
 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Register to VideoConnect</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {["username", "email", "first_name", "last_name", "password"].map((fieldName) => (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName}
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor={field.name} className="capitalize">
                        {field.name.replace("_", " ")}
                      </Label>
                      <FormControl>
                        <Input
                          {...field}
                          id={field.name}
                          type={field.name === "password" ? "password" : "text"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="submit" className="w-full">
                Register
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="ml-1 text-primary hover:underline">
            Login
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
