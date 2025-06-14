import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface SidebarInputProps {
  onGenerate: (structure: {
    judul: string;
    topik: string;
    babInput: string; // Changed to string for natural language input
  }) => void;
}

export default function SidebarInput({ onGenerate }: SidebarInputProps) {
  const [judul, setJudul] = useState("");
  const [topik, setTopik] = useState("");
  const [babInput, setBabInput] = useState(""); // Natural language input for chapters

  const handleSubmit = () => {
    onGenerate({ judul, topik, babInput });
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
          <Label htmlFor="bab">Struktur Bab (Deskripsi)</Label>
          <Textarea
            id="bab"
            value={babInput}
            onChange={(e) => setBabInput(e.target.value)}
            placeholder={`Contoh:
- Bab 1: Pendahuluan (Latar Belakang, Rumusan Masalah)
- Bab 2: Pembahasan (Konsep Dasar AI, Implementasi AI dalam Pembelajaran)
- Bab 3: Penutup (Kesimpulan, Saran)`}
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
