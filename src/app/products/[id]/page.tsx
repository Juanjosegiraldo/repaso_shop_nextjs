"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { getProductById, type Product } from "@/services/productService";
import { getCommentsByProduct, type Comment } from "@/services/comments";
import { addToCart } from "@/services/cart";
import { useAuth } from "@/context/AuthContext";
import CommentForm from "@/components/CommentForm";
import CommentList from "@/components/CommentList";

export default function ProductDetailPage() {
  // On the client, useParams() returns the already-resolved params object.
  const params = useParams<{ id: string }>();
  const id = params.id;

  const router = useRouter();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartMessage, setCartMessage] = useState("");

  const handleAddToCart = async () => {
    // Protected action: send anonymous users to login.
    if (!user) {
      router.push("/login");
      return;
    }
    const ok = await addToCart(user._id, id);
    setCartMessage(ok ? "Added to cart." : "Could not add to cart.");
  };

  useEffect(() => {
    if (!id) return;
    Promise.all([getProductById(id), getCommentsByProduct(id)])
      .then(([fetchedProduct, fetchedComments]) => {
        setProduct(fetchedProduct);
        setComments(fetchedComments);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Append the new comment to local state so it shows without a reload.
  const handleCreated = (comment: Comment) => {
    setComments((prev) => [...prev, comment]);
  };

  if (loading) {
    return (
      <main className="p-6">
        <p>Loading...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="p-6">
        <p>Producto no encontrado.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-6">
      <section>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="mt-1 text-xl">${product.price.toFixed(2)}</p>

        {product.description && <p className="mt-3">{product.description}</p>}

        {product.specs.length > 0 && (
          <ul className="mt-3 list-disc pl-5 text-sm">
            {product.specs.map((spec, index) => (
              <li key={index}>{spec}</li>
            ))}
          </ul>
        )}

        <p className="mt-3 text-sm text-gray-600">Stock: {product.stock}</p>

        <Button className="mt-4" onPress={handleAddToCart}>
          Add to cart
        </Button>
        {cartMessage && <p className="mt-2 text-sm">{cartMessage}</p>}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Comments</h2>
        <CommentForm productId={id} onCreated={handleCreated} />
        <div className="mt-4">
          <CommentList comments={comments} />
        </div>
      </section>
    </main>
  );
}
