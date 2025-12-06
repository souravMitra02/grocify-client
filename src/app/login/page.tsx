"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

import { useAppDispatch } from "@/redux/hooks";
import { loginSuccess } from "@/redux/authSlice";
import { authHelper } from "@/lib/auth";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import banner from "../../../public/login-image2.png";
import logo from "../../../public/logo-image.png";

interface LoginForm {
  email: string;
  password: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://grocify-server-production.up.railway.app";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const router = useRouter();
  const dispatch = useAppDispatch();

  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setLoginError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setLoginError(result?.message || "Invalid credentials");
        return;
      }
      if (result.token) authHelper.setToken(result.token);

      // Update Redux state
      dispatch(loginSuccess(data.email));

      // Redirect to products dashboard
      router.push("/dashboard/products");
    } catch (err) {
      console.error("Login error:", err);
      setLoginError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-lime-500 to-emerald-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-white/40"
      >
        {/* Banner */}
        <div className="hidden md:block md:w-1/2 aspect-[4/3] md:aspect-auto relative">
          <Image
            src={banner}
            alt="Login Banner"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
          <div className="flex justify-center mb-3">
            <Image
              src={logo}
              alt="Logo"
              width={85}
              height={85}
              className="rounded-full shadow-md border bg-white"
            />
          </div>

          <h2 className="text-center text-3xl font-extrabold bg-gradient-to-r from-emerald-500 to-lime-400 bg-clip-text text-transparent drop-shadow-sm">
            Grocify
          </h2>

          <p className="text-center text-gray-500 text-sm mt-2 mb-6">
            Track, manage, and grow your store.
          </p>

          {loginError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-red-600 mb-3 text-sm"
            >
              {loginError}
            </motion.p>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="text-gray-700 text-sm">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus-within:border-green-500">
                <Input
                  type="email"
                  placeholder="admin@demo.com"
                  className="bg-transparent border-none focus-visible:ring-0 px-0 h-8"
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-gray-700 text-sm">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus-within:border-green-500">
                <Input
                  type={showPass ? "text" : "password"}
                  placeholder="123456"
                  className="bg-transparent border-none focus-visible:ring-0 px-0 h-8"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-4 text-gray-600 hover:text-gray-800"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              disabled={loading}
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 py-2.5 rounded-lg text-white font-semibold shadow-md text-sm"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="text-center text-gray-500 text-xs mt-4">
            Demo: admin@demo.com / 123456
          </p>
        </div>
      </motion.div>
    </div>
  );
}
