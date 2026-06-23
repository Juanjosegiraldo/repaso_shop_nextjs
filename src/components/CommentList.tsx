"use client";

import type { Comment } from "@/services/comments";
import { useTranslation } from "@/context/i18nContext";

interface CommentListProps {
  comments: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {
  const { text } = useTranslation();

  if (comments.length === 0) {
    return <p className="text-gray-600">{text.detail.noComments}</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {comments.map((comment) => (
        <li key={comment._id} className="rounded border p-3">
          <p>{comment.content}</p>
          <span className="text-xs text-gray-500">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
        </li>
      ))}
    </ul>
  );
}
