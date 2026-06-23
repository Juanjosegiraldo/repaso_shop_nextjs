"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { createComment, type Comment } from "@/services/comments";

interface CommentFormProps {
  productId: string;
  onCreated: (comment: Comment) => void;
}

export default function CommentForm({ productId, onCreated }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = content.trim();
    if (text === "") return;

    setLoading(true);
    try {
      const comment = await createComment(productId, text);
      if (comment) {
        onCreated(comment);
        setContent(""); // clear the input only after a successful create
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="flex-1"
      />
      <Button type="submit" isDisabled={loading}>
        {loading ? "Sending..." : "Send"}
      </Button>
    </form>
  );
}
