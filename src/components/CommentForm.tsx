"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { createComment, type Comment } from "@/services/comments";
import { useTranslation } from "@/context/i18nContext";

interface CommentFormProps {
  productId: string;
  onCreated: (comment: Comment) => void;
}

export default function CommentForm({ productId, onCreated }: CommentFormProps) {
  const { text } = useTranslation();
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
        placeholder={text.detail.commentPlaceholder}
        className="flex-1"
      />
      <Button type="submit" isDisabled={loading}>
        {loading ? text.detail.sending : text.detail.send}
      </Button>
    </form>
  );
}
