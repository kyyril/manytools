import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface SidebarInputProps {
  onGenerate: (structure: {
    judul: string;
    topik: string;
    bab: { title: string; sub: { title: string }[] }[];
  }) => void;
}

export default function SidebarInput({ onGenerate }: SidebarInputProps) {
  const [judul, setJudul] = useState("");
  const [topik, setTopik] = useState("");
  const [babInput, setBabInput] = useState(""); // JSON string for chapters

  const handleSubmit = () => {
    try {
      const bab = JSON.parse(babInput);
      onGenerate({ judul, topik, bab });
    } catch (error) {
      alert(
        'Invalid JSON for Chapters. Please use the format: [{"title": "Bab 1", "sub": [{"title": "Subbab 1.1"}]}]'
      );
      console.error("Error parsing chapter JSON:", error);
    }
  };

  return (
    <div className="w-80 p-6 border-r overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">MakalahAI Builder</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="judul">Judul Makalah</Label>
          <Input
            id="judul"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="Pengaruh AI dalam Pendidikan"
          />
        </div>
        <div>
          <Label htmlFor="topik">Topik Utama</Label>
          <Input
            id="topik"
            value={topik}
            onChange={(e) => setTopik(e.target.value)}
            placeholder="Pendidikan, Teknologi AI"
          />
        </div>
        <div>
          <Label htmlFor="bab">Struktur Bab (JSON)</Label>
          <Textarea
            id="bab"
            value={babInput}
            onChange={(e) => setBabInput(e.target.value)}
            placeholder={`[
  {"title": "Pendahuluan", "sub": [
    {"title": "Latar Belakang"},
    {"title": "Rumusan Masalah"}
  ]},
  {"title": "Pembahasan", "sub": [
    {"title": "Konsep Dasar AI"},
    {"title": "Implementasi AI dalam Pembelajaran"}
  ]}
]`}
            rows={10}
            className="font-mono text-xs"
          />
        </div>
        <Button onClick={handleSubmit} className="w-full">
          Generate Makalah
        </Button>
      </div>
    </div>
  );
}
