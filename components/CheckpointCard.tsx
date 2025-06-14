import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";

interface CheckpointCardProps {
  id: string;
  title: string;
  lastCheckpoint: string;
  onDelete: (id: string) => void;
}

export default function CheckpointCard({
  id,
  title,
  lastCheckpoint,
  onDelete,
}: CheckpointCardProps) {
  return (
    <div className="border p-4 rounded-md shadow-sm flex flex-col justify-between dark:bg-gray-800">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Last saved: {new Date(lastCheckpoint).toLocaleString()}
        </p>
      </div>
      <div className="flex space-x-2 mt-4">
        <Link href={`/checkpoint/${id}`} className="flex-1">
          <Button className="w-full">Continue Draft</Button>
        </Link>
        <Button variant="destructive" onClick={() => onDelete(id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}
