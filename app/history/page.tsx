"use client";

import React, { useEffect, useState } from "react";
import {
  getAllCheckpoints,
  MakalahStructure,
  deleteCheckpoint,
} from "@/lib/checkpoint";
import CheckpointCard from "@/components/CheckpointCard";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HistoryPage() {
  const [checkpoints, setCheckpoints] = useState<MakalahStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCheckpoints();
  }, []);

  const fetchCheckpoints = async () => {
    setLoading(true);
    try {
      const allCheckpoints = await getAllCheckpoints();
      setCheckpoints(allCheckpoints);
    } catch (error) {
      console.error("Error fetching checkpoints:", error);
      toast({
        title: "Error",
        description: "Failed to load project history.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this draft?")) {
      try {
        await deleteCheckpoint(id);
        toast({
          title: "Success",
          description: "Makalah draft deleted successfully.",
        });
        fetchCheckpoints(); // Refresh the list
      } catch (error) {
        console.error("Error deleting checkpoint:", error);
        toast({
          title: "Error",
          description: "Failed to delete draft.",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Loading Project History...</h1>
        <p>Please wait while your saved drafts are being loaded.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Project History</h1>
      {checkpoints.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No saved makalah drafts found.
          </p>
          <Link href="/builder">
            <Button className="mt-4">Start New Makalah</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {checkpoints.map((makalah) => (
            <CheckpointCard
              key={makalah.id}
              id={makalah.id}
              title={makalah.judul || "Untitled Makalah"}
              lastCheckpoint={makalah.lastCheckpoint}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
