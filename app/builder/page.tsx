"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SidebarInput from "@/components/SidebarInput";
import ChunkDisplay from "@/components/ChunkDisplay";
import Editor from "@/components/Editor";
import {
  MakalahStructure,
  saveCheckpoint,
  loadCheckpoint,
  Chapter,
  SubChapter,
} from "@/lib/checkpoint";
import { generateChunkedContent } from "@/lib/gemini";
import { countTokens } from "@/lib/tokenizer";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import makalahSampleData from "@/data/makalah-sample.json";

interface InitialMakalahStructure {
  judul: string;
  topik: string;
  bab: { title: string; sub: { title: string }[] }[];
}

export default function BuilderPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkpointId = searchParams.get("id");

  const [makalah, setMakalah] = useState<MakalahStructure | null>(null);
  const [currentChunkContent, setCurrentChunkContent] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentSubChapterIndex, setCurrentSubChapterIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadSample = () => {
    const newMakalahId = uuidv4();
    const newMakalah: MakalahStructure = {
      id: newMakalahId,
      judul: makalahSampleData.title,
      topik: makalahSampleData.title, // Using title as topic for simplicity
      abstrak: makalahSampleData.abstract,
      bab: makalahSampleData.sections.map((section) => ({
        title: section.heading,
        sub: [
          {
            title: section.heading, // Sub-chapter title same as chapter for simplicity
            content: section.content,
            generated: true,
          },
        ],
      })),
      referensi: "",
      lastCheckpoint: new Date().toISOString(),
    };
    setMakalah(newMakalah);
    setCurrentChunkContent(newMakalah.abstrak);
    setEditorContent(newMakalah.abstrak);
    setCurrentChapterIndex(0);
    setCurrentSubChapterIndex(0);
    toast({
      description: "Loaded sample makalah data.",
    });
  };

  useEffect(() => {
    const initializeMakalah = async () => {
      if (checkpointId) {
        const loadedMakalah = await loadCheckpoint(checkpointId);
        if (loadedMakalah) {
          setMakalah(loadedMakalah);
          // Set current chunk/editor content to the last generated sub-chapter if available
          let lastGeneratedContent = "";
          let lastChapIdx = 0;
          let lastSubChapIdx = 0;
          for (let i = loadedMakalah.bab.length - 1; i >= 0; i--) {
            for (let j = loadedMakalah.bab[i].sub.length - 1; j >= 0; j--) {
              if (loadedMakalah.bab[i].sub[j].generated) {
                lastGeneratedContent = loadedMakalah.bab[i].sub[j].content;
                lastChapIdx = i;
                lastSubChapIdx = j;
                break;
              }
            }
            if (lastGeneratedContent) break;
          }
          setCurrentChunkContent(
            lastGeneratedContent || loadedMakalah.abstrak || ""
          );
          setEditorContent(lastGeneratedContent || loadedMakalah.abstrak || "");
          setCurrentChapterIndex(lastChapIdx);
          setCurrentSubChapterIndex(lastSubChapIdx);
          toast({
            description: `Loaded checkpoint: ${loadedMakalah.judul}`,
          });
        } else {
          toast({
            title: "Error",
            description: "Checkpoint not found. Starting a new makalah.",
            variant: "destructive",
          });
          startNewMakalah();
        }
      } else {
        startNewMakalah();
      }
    };

    initializeMakalah();
  }, [checkpointId]);

  const startNewMakalah = () => {
    const newMakalahId = uuidv4();
    setMakalah({
      id: newMakalahId,
      judul: "",
      topik: "",
      abstrak: "",
      bab: [],
      referensi: "",
      lastCheckpoint: new Date().toISOString(),
    });
  };

  useEffect(() => {
    if (makalah) {
      saveCheckpoint(makalah);
    }
  }, [makalah]);

  const handleInitialGenerate = async (
    initialStructure: InitialMakalahStructure
  ) => {
    if (!makalah) return;

    setIsLoading(true);
    try {
      const updatedBab: Chapter[] = initialStructure.bab.map((chap) => ({
        ...chap,
        sub: chap.sub.map((subChap) => ({
          ...subChap,
          content: "",
          generated: false,
        })),
      }));

      const updatedMakalah: MakalahStructure = {
        ...makalah,
        judul: initialStructure.judul,
        topik: initialStructure.topik,
        bab: updatedBab,
        referensi: "", // Initialize referensi
        lastCheckpoint: new Date().toISOString(),
      };
      setMakalah(updatedMakalah);

      // Generate abstract first
      const abstractInstruction = `Generate a concise abstract for a makalah titled "${initialStructure.judul}" on the topic of "${initialStructure.topik}".`;
      const abstractContent = await generateChunkedContent(
        abstractInstruction,
        "",
        "Abstract" // Use a generic name for the abstract chunk request
      );

      if (abstractContent.error) {
        throw new Error(abstractContent.error); // Propagate the specific error
      }

      setMakalah((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          abstrak: abstractContent.content,
        };
      });
      setCurrentChunkContent(abstractContent.content);
      setEditorContent(abstractContent.content);

      toast({
        description:
          "Initial structure and abstract generated! You can now start generating chapters.",
      });
    } catch (error: any) {
      console.error("Error during initial generation:", error);
      toast({
        title: "Error",
        description: `Failed to generate initial structure: ${
          error.message || "Unknown error"
        }. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateNextChunk = async () => {
    if (!makalah || isLoading) return;

    setIsLoading(true);
    let nextChapterIdx = currentChapterIndex;
    let nextSubChapterIdx = currentSubChapterIndex;

    // Find the next ungenerated sub-chapter
    let foundNext = false;
    for (let i = currentChapterIndex; i < makalah.bab.length; i++) {
      for (
        let j = i === currentChapterIndex ? currentSubChapterIndex : 0;
        j < makalah.bab[i].sub.length;
        j++
      ) {
        if (!makalah.bab[i].sub[j].generated) {
          nextChapterIdx = i;
          nextSubChapterIdx = j;
          foundNext = true;
          break;
        }
      }
      if (foundNext) break;
    }

    if (!foundNext) {
      toast({
        title: "Info",
        description: "All chapters and sub-chapters have been generated!",
      });
      setIsLoading(false);
      return;
    }

    const currentChapter = makalah.bab[nextChapterIdx];
    const currentSubChapter = currentChapter.sub[nextSubChapterIdx];

    const instruction = `Generate content for the "${currentSubChapter.title}" sub-chapter under the "${currentChapter.title}" chapter for a makalah titled "${makalah.judul}" on the topic of "${makalah.topik}".`;

    // Build context from previously generated content
    let context = `Abstract: ${makalah.abstrak}\n\n`;
    for (let i = 0; i <= nextChapterIdx; i++) {
      context += `Chapter ${i + 1}: ${makalah.bab[i].title}\n`;
      for (
        let j = 0;
        j <
        (i === nextChapterIdx ? nextSubChapterIdx : makalah.bab[i].sub.length);
        j++
      ) {
        if (makalah.bab[i].sub[j].generated) {
          context += `  Sub-chapter ${i + 1}.${j + 1}: ${
            makalah.bab[i].sub[j].title
          }\n`;
          context += `${makalah.bab[i].sub[j].content}\n\n`;
        }
      }
    }

    try {
      const generated = await generateChunkedContent(
        instruction,
        context,
        currentSubChapter.title
      );
      const newContent = generated.content;
      if (generated.error) {
        toast({
          title: "Error",
          description: `Failed to generate content for "${currentSubChapter.title}": ${generated.error}`,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      setMakalah((prev) => {
        if (!prev) return null;
        const updatedBab = [...prev.bab];
        updatedBab[nextChapterIdx].sub[nextSubChapterIdx] = {
          ...updatedBab[nextChapterIdx].sub[nextSubChapterIdx],
          content: newContent,
          generated: true,
        };
        return {
          ...prev,
          bab: updatedBab,
          lastCheckpoint: new Date().toISOString(),
        };
      });

      setCurrentChunkContent(newContent);
      setEditorContent(newContent);
      setCurrentChapterIndex(nextChapterIdx);
      setCurrentSubChapterIndex(nextSubChapterIdx);

      toast({
        title: "Success",
        description: `Content for "${currentSubChapter.title}" has been generated.`,
      });
    } catch (error: any) {
      console.error("Error generating chunk:", error);
      toast({
        title: "Error",
        description: `Failed to generate content for "${
          currentSubChapter.title
        }": ${error.message || "Unknown error"}.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditorChange = (newContent: string) => {
    setEditorContent(newContent);
    if (
      makalah &&
      makalah.bab[currentChapterIndex] &&
      makalah.bab[currentChapterIndex].sub[currentSubChapterIndex]
    ) {
      setMakalah((prev) => {
        if (!prev) return null;
        const updatedBab = [...prev.bab];
        updatedBab[currentChapterIndex].sub[currentSubChapterIndex].content =
          newContent;
        return {
          ...prev,
          bab: updatedBab,
          lastCheckpoint: new Date().toISOString(),
        };
      });
    }
  };

  const saveCurrentProgress = async () => {
    if (makalah) {
      await saveCheckpoint(makalah);
      toast({
        title: "Success",
        description: "Your current makalah draft has been saved.",
      });
    }
  };

  return (
    <div className="flex h-screen">
      <SidebarInput onGenerate={handleInitialGenerate} />
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold">MakalahAI Builder</h1>
          <div className="space-x-2">
            <Button onClick={handleLoadSample} disabled={isLoading}>
              Load Sample
            </Button>
            <Button
              onClick={generateNextChunk}
              disabled={isLoading || !makalah || makalah.bab.length === 0}
            >
              {isLoading ? "Generating..." : "Generate Next Chunk"}
            </Button>
            <Button onClick={saveCurrentProgress} disabled={!makalah}>
              Save Progress
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <ChunkDisplay content={currentChunkContent} />
          <Editor
            content={editorContent}
            onContentChange={handleEditorChange}
          />
        </div>
      </div>
    </div>
  );
}
