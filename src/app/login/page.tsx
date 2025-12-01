"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSuccess } from "@/redux/authSlice";
import { useAppDispatch } from "@/redux/hooks";


interface LoginForm {
  email: string;
  password: string;
}

const demoCredentials: LoginForm = {
  email: "admin@demo.com",
  password: "123456"
};

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loginError, setLoginError] = useState<string>("");

  const onSubmit: SubmitHandler<LoginForm> = (data) => {
    if (data.email === demoCredentials.email && data.password === demoCredentials.password) {
      dispatch(loginSuccess(data.email));
      document.cookie = "jwt=demoToken123; path=/; max-age=3600";
      router.push("/dashboard/products");
    } else {
      setLoginError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="max-w-md w-full bg-gray-200 p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-white text-center mb-2">Grocify</h1>
        <p className="text-gray-300 text-center mb-6">Welcome back! Please login.</p>

        {loginError && <p className="text-red-400 text-center mb-4">{loginError}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
           
            placeholder="admin@demo.com"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}

          <Input
          
            type="password"
            placeholder="123456"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}

          <Button type="submit" className="w-full mt-4">Login</Button>
        </form>

        <p className="text-gray-400 text-sm mt-4 text-center">
          Demo credentials: admin@demo.com / 123456
        </p>
      </div>
    </div>
  );
}
