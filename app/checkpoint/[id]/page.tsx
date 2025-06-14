"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MakalahStructure, loadCheckpoint } from "@/lib/checkpoint";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CheckpointPageProps {
  params: {
    id: string;
  };
}

export default function CheckpointPage({ params }: CheckpointPageProps) {
  const { id } = params;
  const [makalah, setMakalah] = useState<MakalahStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCheckpoint = async () => {
      if (id) {
        try {
          const loadedMakalah = await loadCheckpoint(id);
          if (loadedMakalah) {
            setMakalah(loadedMakalah);
          } else {
            setError("Makalah not found.");
          }
        } catch (err) {
          console.error("Error loading checkpoint:", err);
          setError("Failed to load checkpoint.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCheckpoint();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Loading Makalah...</h1>
        <p>Please wait while your draft is being loaded.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-red-500">Error</h1>
        <p>{error}</p>
        <Link href="/">
          <Button className="mt-4">Go to Home</Button>
        </Link>
      </div>
    );
  }

  if (!makalah) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">No Makalah Loaded</h1>
        <p>No makalah data could be loaded. Please check the ID.</p>
        <Link href="/">
          <Button className="mt-4">Go to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Continue MakalahAI Progress: {makalah.judul}
      </h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Topic:</h2>
          <p>{makalah.topik}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Abstract:</h2>
          <p>{makalah.abstrak || "Not yet generated."}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Chapters:</h2>
          {makalah.bab.length > 0 ? (
            <ul className="list-disc pl-5">
              {makalah.bab.map((chapter, chapIdx) => (
                <li key={chapIdx} className="mt-2">
                  <span className="font-medium">{chapter.title}</span>
                  {chapter.sub.length > 0 && (
                    <ul className="list-circle pl-5">
                      {chapter.sub.map((subChap, subIdx) => (
                        <li key={`${chapIdx}-${subIdx}`} className="mt-1">
                          {subChap.title}{" "}
                          {subChap.generated && (
                            <span className="text-green-600">(Generated)</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No chapters defined.</p>
          )}
        </div>
        <div className="mt-6">
          <Link href={`/builder?id=${makalah.id}`}>
            <Button>Continue Editing</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
