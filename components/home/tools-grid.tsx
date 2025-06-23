"use client";

import { useRouter } from "next/navigation";
import {
  FileText,
  Scissors,
  FileCheck,
  FileSpreadsheet,
  AlertTriangle,
  Bot,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const tools = [
  {
    id: "paraphrase",
    title: "Paraphrase Text",
    description: "Rewrite content to make it unique while preserving meaning",
    icon: Scissors,
    path: "/tools/paraphrase",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: "summarize",
    title: "Summarize Text",
    description: "Condense long content into concise summaries",
    icon: FileText,
    path: "/tools/summarize",
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    id: "grammar",
    title: "Grammar Checker",
    description: "Fix grammar, spelling, and punctuation errors",
    icon: FileCheck,
    path: "/tools/grammar",
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    id: "plagiarism",
    title: "AI Plagiarism Check",
    description: "Verify text originality and detect potential plagiarism",
    icon: AlertTriangle,
    path: "/tools/plagiarism",
    color: "bg-red-500/10 text-red-500",
  },
];

const ToolsGrid = () => {
  const router = useRouter();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-16 container">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          Our AI-Powered Tools
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Access a comprehensive suite of AI tools designed to enhance your
          writing and content creation process.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {tools.map((tool) => (
          <motion.div key={tool.id} variants={item}>
            <Card
              className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              onClick={() => router.push(tool.path)}
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center mb-4`}
                >
                  <tool.icon size={24} />
                </div>
                <CardTitle>{tool.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{tool.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full justify-start">
                  Try Now
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ToolsGrid;
