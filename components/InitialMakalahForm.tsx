"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InitialMakalahStructure {
  judul: string;
  topik: string;
  babInput: string; // Changed to string for natural language input
}

interface InitialMakalahFormProps {
  onGenerate: (initialStructure: InitialMakalahStructure) => void;
  isLoading: boolean;
}

const InitialMakalahForm: React.FC<InitialMakalahFormProps> = ({
  onGenerate,
  isLoading,
}) => {
  const [judul, setJudul] = React.useState("");
  const [topik, setTopik] = React.useState("");
  const [babInput, setBabInput] = React.useState("");

  const handleSubmit = () => {
    if (judul && topik && babInput) {
      onGenerate({ judul, topik, babInput });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Create Makalah</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create New Makalah</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the details for your new makalah.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="judul" className="text-right">
              Judul
            </Label>
            <Input
              id="judul"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="topik" className="text-right">
              Topik
            </Label>
            <Input
              id="topik"
              value={topik}
              onChange={(e) => setTopik(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="babInput" className="text-right">
              Chapter Structure
            </Label>
            <Input
              id="babInput"
              value={babInput}
              onChange={(e) => setBabInput(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InitialMakalahForm;
