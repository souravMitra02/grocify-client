"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { motion } from "framer-motion";
import { Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface ProductTableProps {
  onEdit: (product: Product) => void;
}

export default function ProductTable({ onEdit }: ProductTableProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snapshot) => {
      const list: Product[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Product),
      }));
      setProducts(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "products", id));
  };

  const handleStatus = async (product: Product) => {
    await updateDoc(doc(db, "products", product.id), {
      status: product.status === "active" ? "inactive" : "active",
    });
  };

  const columns: ColumnDef<Product>[] = [
    {
      header: "Category",
      accessorKey: "category",
    },
    {
      header: "Name",
      accessorKey: "name",
    },
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
          className={`px-2 py-1 rounded text-sm font-medium shadow-sm ${
            row.original.status === "active"
              ? "bg-green-600 text-white"
              : "bg-gray-400 text-black"
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
          {/* Edit */}
          <button
            onClick={() => onEdit(row.original)}
            className="flex items-center gap-1 p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition shadow"
          >
            <Pencil size={18} className="text-blue-600" />
            <span className="text-blue-700 text-sm">Edit</span>
          </button>
          <button
            onClick={() => handleStatus(row.original)}
            className="flex items-center gap-1 p-2 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 transition shadow"
          >
            {row.original.status === "active" ? (
              <ToggleRight size={22} className="text-yellow-600" />
            ) : (
              <ToggleLeft size={22} className="text-gray-600" />
            )}
            <span className="text-yellow-700 text-sm">
              {row.original.status === "active" ? "Active" : "Inactive"}
            </span>
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="flex items-center gap-1 p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition shadow"
          >
            <Trash2 size={18} className="text-red-600" />
            <span className="text-red-700 text-sm">Delete</span>
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
      className="rounded-xl border bg-gray-50 p-5 shadow-xl"
    >
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b bg-gray-100">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="py-3 px-3 font-semibold text-gray-700"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row, i) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                className="border-b hover:bg-gray-100/60 transition"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-3 px-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </motion.tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-5 text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </motion.div>
  );
}
