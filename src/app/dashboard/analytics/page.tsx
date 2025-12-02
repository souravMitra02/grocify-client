"use client";

import { useEffect, useState } from "react";
import { db, collection, onSnapshot } from "@/lib/firebase";
import ChartCard from "@/components/ChartCard";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

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

  const COLORS = ["#4ade80", "#f87171"];

  const categoryData = Object.values(
    products.reduce((acc, p) => {
      acc[p.category] = acc[p.category] ? acc[p.category] + 1 : 1;
      return acc;
    }, {} as Record<string, number>)
  ).map((count, idx, arr) => ({ name: Object.keys(products.reduce((acc, p) => {
      acc[p.category] = acc[p.category] ? acc[p.category] + 1 : 1; return acc;
    }, {}))[idx], value: count }));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Analytics</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <ChartCard title="Total Products">
          <p className="text-white text-xl">{totalProducts}</p>
        </ChartCard>

        <ChartCard title="Active vs Inactive Products">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={60} fill="#8884d8">
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Products by Category">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="value" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
