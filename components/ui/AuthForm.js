"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";

const authSchema = (mode) =>
  z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    ...(mode === "signup" && {
      name: z.string().min(2, "Name is required"),
    }),
  });

export default function AuthForm({ mode = "signin", onSubmit }) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(authSchema(mode)),
    defaultValues:
      mode === "signup"
        ? { name: "", email: "", password: "" }
        : { email: "", password: "" },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (err) {
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
    //   window.location.href = "/api/auth/google";
    } catch (err) {
      console.error("Google sign-in error:", err);
    }
  };

  const {
    register,
    handleSubmit: submit,
    formState: { errors },
  } = form;

  return (
    <Card className="w-full max-w-sm mx-auto p-6 shadow-md rounded-2xl">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-center">
          {mode === "signup" ? "Create an Account" : "Welcome Back"}
        </h2>
        <p className="text-sm text-gray-500 text-center">
          {mode === "signup"
            ? "Sign up to get started"
            : "Sign in to continue"}
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={submit(handleSubmit)} className="space-y-4">
          {mode === "signup" && (
            <div>
              <Label className="mb-1" htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
          )}

          <div>
            <Label className="mb-1" htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label className="mb-1" htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "signup"
              ? "Sign Up"
              : "Sign In"}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative mt-6 mb-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">or continue with</span>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2"
        >
          <FcGoogle size={20} />
          Sign in with Google
        </Button>
      </CardContent>

      <CardFooter className="text-center text-sm text-gray-600">
        {mode === "signup" ? (
          <p>
            Already have an account?{" "}
            <a href="/signin" className="text-primary hover:underline">
              Sign in
            </a>
          </p>
        ) : (
          <p>
            Don’t have an account?{" "}
            <a href="/signup" className="text-primary hover:underline">
              Sign up
            </a>
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
