import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MakalahStructure, loadCheckpoint } from "@/lib/checkpoint";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function ExportPage() {
  const searchParams = useSearchParams();
  const checkpointId = searchParams.get("id");
  const [makalah, setMakalah] = useState<MakalahStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMakalah = async () => {
      if (checkpointId) {
        try {
          const loadedMakalah = await loadCheckpoint(checkpointId);
          if (loadedMakalah) {
            setMakalah(loadedMakalah);
          } else {
            setError("Makalah not found for export.");
          }
        } catch (err) {
          console.error("Error loading makalah for export:", err);
          setError("Failed to load makalah for export.");
        } finally {
          setLoading(false);
        }
      } else {
        setError("No makalah ID provided for export.");
        setLoading(false);
      }
    };
    fetchMakalah();
  }, [checkpointId]);

  const generateMarkdown = (makalah: MakalahStructure): string => {
    let markdown = `# ${makalah.judul}\n\n`;
    markdown += `**Topic:** ${makalah.topik}\n\n`;
    markdown += `## Abstract\n\n${makalah.abstrak}\n\n`;

    makalah.bab.forEach((chapter, chapIdx) => {
      markdown += `## Chapter ${chapIdx + 1}: ${chapter.title}\n\n`;
      chapter.sub.forEach((subChapter, subIdx) => {
        markdown += `### ${chapIdx + 1}.${subIdx + 1} ${subChapter.title}\n\n`;
        markdown += `${subChapter.content || "Content not generated yet."}\n\n`;
      });
    });

    if (makalah.referensi) {
      markdown += `## References\n\n${makalah.referensi}\n\n`;
    }

    return markdown;
  };

  const handleExportPDF = async () => {
    if (!makalah) {
      toast({
        title: "Error",
        description: "No makalah data to export.",
      });
      return;
    }
    toast({
      title: "Exporting PDF",
      description: "Generating PDF... This may take a moment.",
    });
    const markdownContent = generateMarkdown(makalah);
    // In a real application, you would send this markdown to a backend
    // or use a client-side library like html2pdf.js (after converting markdown to HTML)
    // For now, we'll just log it and suggest saving as .md
    console.log("Generated Markdown for PDF export:", markdownContent);
    toast({
      title: "PDF Export (Simulated)",
      description:
        "PDF generation logic would go here. Consider saving as .md for now.",
    });
  };

  const handleExportDOCX = async () => {
    if (!makalah) {
      toast({
        title: "Error",
        description: "No makalah data to export.",
      });
      return;
    }
    toast({
      title: "Exporting DOCX",
      description: "Generating DOCX... This may take a moment.",
    });
    const markdownContent = generateMarkdown(makalah);
    // In a real application, you would send this markdown to a backend
    // or use a client-side library like mammoth.js/docx
    console.log("Generated Markdown for DOCX export:", markdownContent);
    toast({
      title: "DOCX Export (Simulated)",
      description:
        "DOCX generation logic would go here. Consider saving as .md for now.",
    });
  };

  const handleSaveMarkdown = () => {
    if (!makalah) {
      toast({
        title: "Error",
        description: "No makalah data to save.",
      });
      return;
    }
    const markdownContent = generateMarkdown(makalah);
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${makalah.judul || "untitled"}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Success",
      description: "Makalah saved as Markdown file.",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Loading Makalah for Export...
        </h1>
        <p>Please wait while your makalah is being prepared.</p>
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
        <h1 className="text-3xl font-bold mb-6">No Makalah Data</h1>
        <p>
          Please go back to the builder or history to select a makalah to
          export.
        </p>
        <Link href="/history">
          <Button className="mt-4">View Project History</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Export Makalah: {makalah.judul}
      </h1>
      <div className="space-y-4">
        <p className="text-lg">
          Your makalah is ready for export. Choose your desired format:
        </p>
        <div className="flex space-x-4">
          <Button onClick={handleExportPDF}>Export as PDF</Button>
          <Button onClick={handleExportDOCX}>Export as DOCX</Button>
          <Button onClick={handleSaveMarkdown} variant="outline">
            Save as Markdown (.md)
          </Button>
        </div>
        <div className="mt-8 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-2">
            Makalah Preview (Markdown)
          </h2>
          <pre className="whitespace-pre-wrap text-sm font-mono">
            {generateMarkdown(makalah)}
          </pre>
        </div>
      </div>
    </div>
  );
}
