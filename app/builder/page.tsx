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
  babInput: string; // Changed to string for natural language input
}

interface ParsedMakalahStructure {
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
      // Use Gemini to parse the natural language babInput into a structured format
      const parseInstruction = `Parse the following natural language chapter structure into a JSON array of chapters and sub-chapters. Each chapter should have a 'title' and a 'sub' array. Each sub-chapter should have a 'title'. Do NOT include 'content' or 'generated' fields.
      Example format:
      [
        {"title": "Pendahuluan", "sub": [{"title": "Latar Belakang"}, {"title": "Rumusan Masalah"}]},
        {"title": "Pembahasan", "sub": [{"title": "Konsep Dasar AI"}, {"title": "Implementasi AI dalam Pembelajaran"}]}
      ]
      
      Natural language input: ${initialStructure.babInput}`;

      const parsedBabResponse = await generateChunkedContent(
        parseInstruction,
        "",
        "Chapter Structure Parsing"
      );

      if (parsedBabResponse.error) {
        throw new Error(
          `Failed to parse chapter structure: ${parsedBabResponse.error}`
        );
      }

      let parsedBab: { title: string; sub: { title: string }[] }[] = [];
      try {
        // Clean the JSON string by removing markdown code block fences
        const jsonString = parsedBabResponse.content
          .replace(/```json\n(.*)\n```/s, "$1")
          .trim();
        parsedBab = JSON.parse(jsonString);
      } catch (parseError: any) {
        throw new Error(
          `Invalid JSON received from AI for chapter structure: ${parseError.message}`
        );
      }

      const updatedBab: Chapter[] = parsedBab.map((chap) => ({
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

  const handlePreviousChunk = () => {
    if (!makalah) return;

    let newChapterIdx = currentChapterIndex;
    let newSubChapterIdx = currentSubChapterIndex;

    if (newSubChapterIdx > 0) {
      newSubChapterIdx--;
    } else if (newChapterIdx > 0) {
      newChapterIdx--;
      newSubChapterIdx = makalah.bab[newChapterIdx].sub.length - 1;
    } else {
      // Already at the first chunk (abstract)
      setCurrentChunkContent(makalah.abstrak);
      setEditorContent(makalah.abstrak);
      setCurrentChapterIndex(0);
      setCurrentSubChapterIndex(0);
      return;
    }

    const targetSubChapter = makalah.bab[newChapterIdx].sub[newSubChapterIdx];
    setCurrentChunkContent(targetSubChapter.content);
    setEditorContent(targetSubChapter.content);
    setCurrentChapterIndex(newChapterIdx);
    setCurrentSubChapterIndex(newSubChapterIdx);
  };

  const handleNextChunk = () => {
    if (!makalah) return;

    let newChapterIdx = currentChapterIndex;
    let newSubChapterIdx = currentSubChapterIndex;

    if (newSubChapterIdx < makalah.bab[newChapterIdx].sub.length - 1) {
      newSubChapterIdx++;
    } else if (newChapterIdx < makalah.bab.length - 1) {
      newChapterIdx++;
      newSubChapterIdx = 0;
    } else {
      // Already at the last chunk
      toast({
        title: "Info",
        description: "You are at the end of the makalah.",
      });
      return;
    }

    const targetSubChapter = makalah.bab[newChapterIdx].sub[newSubChapterIdx];
    setCurrentChunkContent(targetSubChapter.content);
    setEditorContent(targetSubChapter.content);
    setCurrentChapterIndex(newChapterIdx);
    setCurrentSubChapterIndex(newSubChapterIdx);
  };

  const formatMakalahForDownload = (makalah: MakalahStructure): string => {
    let formattedContent = `# ${makalah.judul}\n\n`;
    formattedContent += `**Topic:** ${makalah.topik}\n\n`;
    formattedContent += `## Abstract\n${makalah.abstrak}\n\n`;

    makalah.bab.forEach((chapter, chapIdx) => {
      formattedContent += `## Chapter ${chapIdx + 1}: ${chapter.title}\n\n`;
      chapter.sub.forEach((subChapter, subChapIdx) => {
        formattedContent += `### Sub-chapter ${chapIdx + 1}.${
          subChapIdx + 1
        }: ${subChapter.title}\n\n`;
        formattedContent += `${subChapter.content}\n\n`;
      });
    });

    if (makalah.referensi) {
      formattedContent += `## References\n${makalah.referensi}\n\n`;
    }

    return formattedContent;
  };

  const handleDownloadMakalah = () => {
    if (!makalah) {
      toast({
        title: "Error",
        description: "No makalah data to download.",
        variant: "destructive",
      });
      return;
    }

    const fullMakalahContent = formatMakalahForDownload(makalah);
    const blob = new Blob([fullMakalahContent], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${makalah.judul
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}_makalah.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Makalah downloaded successfully!",
    });
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
            <Button onClick={handleDownloadMakalah} disabled={!makalah}>
              Download Makalah
            </Button>
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <Button
              onClick={handlePreviousChunk}
              disabled={
                !makalah ||
                (currentChapterIndex === 0 && currentSubChapterIndex === 0)
              }
            >
              Previous Chunk
            </Button>
            <span className="text-lg font-semibold">
              {makalah?.bab[currentChapterIndex]?.title} -{" "}
              {
                makalah?.bab[currentChapterIndex]?.sub[currentSubChapterIndex]
                  ?.title
              }
            </span>
            <Button
              onClick={handleNextChunk}
              disabled={
                !makalah ||
                (currentChapterIndex === makalah.bab.length - 1 &&
                  currentSubChapterIndex ===
                    makalah.bab[currentChapterIndex].sub.length - 1)
              }
            >
              Next Chunk
            </Button>
          </div>
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
