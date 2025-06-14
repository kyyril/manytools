import React from "react";

interface EditorProps {
  content: string;
  onContentChange: (newContent: string) => void;
}

export default function Editor({ content, onContentChange }: EditorProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Markdown Editor</h2>
      <textarea
        className="w-full h-64 p-2 border rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Edit your content here..."
      />
    </div>
  );
}
