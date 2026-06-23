"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, TextArea } from "@heroui/react";
import { createProductWithImage } from "@/services/productService";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formEl = event.currentTarget;
    setLoading(true);
    setMessage("");

    try {
      // Multipart body: the file is sent as-is, never JSON.
      const form = new FormData(formEl);
      const product = await createProductWithImage(form);

      if (!product) {
        setMessage("Could not create the product. Check the fields.");
        return;
      }

      setMessage(`Created "${product.name}" with image.`);
      formEl.reset();
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-lg p-6">
      <h1 className="mb-4 text-2xl font-bold">New product</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input name="name" type="text" placeholder="Name" required />
        <Input
          name="price"
          type="number"
          step="0.01"
          min="0"
          placeholder="Price"
          required
        />
        <TextArea name="description" placeholder="Description" />
        <Input name="specs" type="text" placeholder="Specs (comma separated)" />
        <Input name="stock" type="number" min="0" placeholder="Stock" />

        <div className="flex flex-col gap-1">
          <label htmlFor="img" className="text-sm">
            Product image
          </label>
          {/* Plain file input: uploads go through multipart/form-data. */}
          <input id="img" name="img" type="file" accept="image/*" required />
        </div>

        <Button type="submit" isDisabled={loading}>
          {loading ? "Uploading..." : "Create product"}
        </Button>
      </form>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </main>
  );
}
