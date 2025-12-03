"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";

import { motion } from "framer-motion";
import { Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types";
import { useEffect, useState } from "react";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => Promise<void>;
  onChangeStatus: (product: Product) => Promise<void>;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  onChangeStatus,
}: ProductTableProps) {
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    setLoading(false);
  }, [products]);

  const columns: ColumnDef<Product>[] = [
    { header: "Category", accessorKey: "category" },
    { header: "Name", accessorKey: "name" },
    {
      header: "Price",
      accessorKey: "price",
      cell: ({ row }) => `$ ${row.original.price}`,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium shadow-sm ${
            row.original.status === "active"
              ? "bg-green-600 text-white"
              : "bg-gray-300 text-black"
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => onEdit(row.original)}
            className="flex items-center gap-1 p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 shadow text-blue-700 text-sm"
          >
            <Pencil size={16} /> Edit
          </button>
          <button
            onClick={() => onChangeStatus(row.original)}
            className="flex items-center gap-1 p-2 rounded-lg bg-yellow-400/20 hover:bg-yellow-400/40 shadow text-yellow-800 text-sm"
          >
            {row.original.status === "active" ? (
              <ToggleRight size={18} />
            ) : (
              <ToggleLeft size={18} />
            )}
            {row.original.status === "active" ? "Active" : "Inactive"}
          </button>
          <button
            onClick={() => onDelete(row.original.id)}
            className="flex items-center gap-1 p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 shadow text-red-700 text-sm"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-xl border bg-white shadow-lg p-5 w-full"
    >
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <div className="min-w-[700px]">
            <table className="w-full text-left border-collapse">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id} className="bg-green-600 text-white">
                    {hg.headers.map((header) => (
                      <th
                        key={header.id}
                        className="py-3 px-4 font-semibold text-left text-sm"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                    className="border-b hover:bg-green-50 transition-all"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-3 px-4 text-sm">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-5 text-gray-400">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
