"use client";

import { useEffect, useState } from "react";
import { db, collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from "@/lib/firebase";
import ProductTable from "@/components/ProductTable";
import ProductModal from "@/components/ProductModal";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);

  const productsCollection = collection(db, "products");
  useEffect(() => {
    const unsubscribe = onSnapshot(productsCollection, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
    });

    return () => unsubscribe();
  }, []);

  const handleAdd = () => {
    setEditProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: any) => {
    setEditProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "products", id));
  };

  const handleChangeStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, "products", id), { status });
  };

  const handleSave = async (product: any) => {
    if (editProduct) {
      
      await updateDoc(doc(db, "products", editProduct.id), product);
    } else {
      await addDoc(productsCollection, product);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Product Management</h1>
        <Button onClick={handleAdd}>Add Product</Button>
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
