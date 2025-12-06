"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, collection, onSnapshot } from "@/lib/firebase";
import { authHelper } from "@/lib/auth";

import ChartCard from "@/components/ChartCard";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Spinner } from "@/components/ui/spinner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://grocify-server-production.up.railway.app";

export default function AnalyticsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/check`, {
          method: "GET",
          credentials: "include", // CRITICAL: Send cookies
          headers: authHelper.getAuthHeaders(),
        });

        if (!res.ok) {
          throw new Error("Authentication failed");
        }

        const data = await res.json();
        if (!data.authenticated) {
          throw new Error("Not authenticated");
        }

        setAuthChecked(true);
      } catch (err) {
        console.error("Auth check failed:", err);
        authHelper.clearLoginState();
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;

    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        setProducts(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setLoading(false);
      },
      (error) => {
        console.error("Firestore error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [authChecked]);

  if (!authChecked || loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <Spinner className="size-16 text-green-500" />
      </div>
    );
  }

  const totalProducts = products.length;

  const statusData = [
    {
      name: "Active",
      value: products.filter((p) => p.status === "active").length,
    },
    {
      name: "Inactive",
      value: products.filter((p) => p.status !== "active").length,
    },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  const categoryCount = products.reduce((acc: any, p: any) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.keys(categoryCount).map((key) => ({
    name: key,
    value: categoryCount[key],
  }));

  return (
    <div className="p-6 space-y-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
        Analytics Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <ChartCard title="Total Products">
          <p className="text-4xl font-semibold text-gray-800">{totalProducts}</p>
          <p className="text-gray-500 mt-1 text-sm">
            All items in inventory
          </p>
        </ChartCard>

        <ChartCard title="Active vs Inactive">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={70}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Products by Category">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#22c55e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}