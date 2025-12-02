"use client";

import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
}

export default function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="bg-[#1e293b] p-4 rounded-lg shadow-md">
      <h2 className="text-white font-semibold mb-2">{title}</h2>
      {children}
    </div>
  );
}
