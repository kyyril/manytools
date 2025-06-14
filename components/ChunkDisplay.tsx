import React from "react";

interface ChunkDisplayProps {
  content: string;
}

export default function ChunkDisplay({ content }: ChunkDisplayProps) {
  return (
    <div className="flex-1 p-4">
      <h2 className="text-xl font-semibold mb-4">Generated Content</h2>
      <div className="border p-4 rounded-md bg-gray-50 dark:bg-gray-800">
        <p>{content || "Generated content will appear here."}</p>
      </div>
    </div>
  );
}
