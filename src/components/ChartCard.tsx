"use client";

import { cn } from "@/lib/utils";

export default function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(
      "bg-[#0f172a]/70 backdrop-blur-md border border-white/10",
      "rounded-xl p-5 shadow-lg hover:shadow-xl transition-all"
    )}>
      <h2 className="text-lg font-semibold text-green-300 mb-3">{title}</h2>
      {children}
    </div>
  );
}
