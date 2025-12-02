"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/redux/hooks";
import { loginSuccess } from "@/redux/authSlice";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginForm) => {
    setLoginError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setLoginError(result?.message || "Couldn't log in. Please check your credentials.");
        return;
      }

      dispatch(loginSuccess(data.email));

      router.push("/dashboard/products");

    } catch (err) {
      console.error("Login error:", err);
      setLoginError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0f172a] min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1e293b] p-8 rounded-lg shadow">
        
        <h1 className="text-3xl font-semibold text-white text-center mb-1">
          Grocify
        </h1>

        <p className="text-gray-400 text-center mb-6">
          Welcome back — sign in to continue
        </p>

        {loginError && (
          <p className="text-red-400 text-center mb-4 text-sm">
            {loginError}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <Input
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <span className="text-red-400 text-xs">
              {errors.email.message}
            </span>
          )}

          <Input
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <span className="text-red-400 text-xs">
              {errors.password.message}
            </span>
          )}

          <Button
            type="submit"
            className="w-full mt-3"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-gray-400 text-xs text-center mt-4">
          Demo credentials: admin@demo.com / 123456
        </p>
      </div>
    </div>
  );
}
