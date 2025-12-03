"use client";

import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProductModal({ product, onClose, onSave }: any) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: product || {
      name: "",
      price: "",
      status: "active",
    },
  });

  const submit = (data:any) => {
    onSave(data);
    reset();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-[#1e293b] text-white">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-4 mt-4">
          <div>
            <label className="text-sm">Product Name</label>
            <Input
              className="mt-1"
              {...register("name", { required: true })}
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="text-sm">Price</label>
            <Input
              className="mt-1"
              type="number"
              {...register("price", { required: true })}
              placeholder="Enter price"
            />
          </div>

          <div>
            <label className="text-sm">Status</label>
            <select
              {...register("status")}
              className="w-full p-2 rounded bg-[#0f172a] mt-1"
            >
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {product ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
