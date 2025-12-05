"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from "@/lib/firebase";
import ProductTable from "@/components/ProductTable";
import ProductModal from "@/components/ProductModal";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("https://grocify-server-production.up.railway.app/api/auth/check", {
          method: "GET",
          credentials: "include",

        });

        const data = await res.json();

        if (!res.ok || !data.authenticated) {
          router.push("/login");
        } else {
          setAuthChecked(true);
        }
      } catch (err) {
        console.error(err);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;

    const productsCollection = collection(db, "products");
    const unsubscribe = onSnapshot(productsCollection, (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [authChecked]);

  const handleAdd = () => {
    setEditProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: any) => {
    setEditProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, "products", id));
    }
  };

  const handleChangeStatus = async (product: any) => {
    const newStatus = product.status === "active" ? "inactive" : "active";
    await updateDoc(doc(db, "products", product.id), { status: newStatus });
  };

  const handleSave = async (product: any) => {
    if (editProduct) {
      await updateDoc(doc(db, "products", editProduct.id), product);
    } else {
      await addDoc(collection(db, "products"), product);
    }
    setIsModalOpen(false);
  };

  if (!authChecked || loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <Spinner className="size-16 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-3 md:mb-0">
          Product Management
        </h1>
        <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700 text-white">
          Add Product
        </Button>
      </div>

      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onChangeStatus={handleChangeStatus}
      />

      {isModalOpen && (
        <ProductModal
          product={editProduct}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
