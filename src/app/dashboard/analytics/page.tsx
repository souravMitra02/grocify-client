"use client";

import { useEffect, useState } from "react";
import { db, collection, onSnapshot } from "@/lib/firebase";
import ChartCard from "@/components/ChartCard";

import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer
} from "recharts";

export default function AnalyticsPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), snapshot => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);


  const totalProducts = products.length;

  const statusData = [
    { name: "Active", value: products.filter(p => p.status === "Active").length },
    { name: "Inactive", value: products.filter(p => p.status !== "Active").length },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  const categoryCount = products.reduce((acc: any, p: any) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.keys(categoryCount).map(key => ({
    name: key,
    value: categoryCount[key],
  }));

  return (
    <div className="p-6 space-y-8">

      <h1 className="text-3xl font-bold text-green-400 tracking-wide">
        Grocery Products Analytics
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        
        <ChartCard title="Total Products">
          <p className="text-4xl font-semibold text-white">{totalProducts}</p>
          <p className="text-gray-400 mt-1 text-sm">All grocery items in the database</p>
        </ChartCard>
        <ChartCard title="Active vs Inactive Products">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={70}
              >
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#1e293b", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Products by Category */}
        <ChartCard title="Products by Category">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ background: "#1e293b", borderRadius: 8 }} />
              <Bar dataKey="value" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </div>
  );
}
