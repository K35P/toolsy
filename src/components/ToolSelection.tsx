import React from "react";
import { DocumentTextIcon, PhotoIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import ToolCard from "./ToolCard";
import { Tool } from "@/types/tool";

const tools: Tool[] = [
  {
    id: "image",
    name: "Image Converter",
    description: "Converti immagini in PNG, JPG, WEBP e altri formati.",
    icon: <PhotoIcon className="h-8 w-8" />,
  },
  {
    id: "document",
    name: "Document Converter",
    description: "Trasforma documenti tra PDF, DOCX, TXT e altri.",
    icon: <DocumentTextIcon className="h-8 w-8" />,
  },
  {
    id: "video",
    name: "Video Converter",
    description: "Converti video in MP4, AVI, MKV e molto altro.",
    icon: <VideoCameraIcon className="h-8 w-8" />,
  },
];

interface ToolSelectionProps {
  onSelect: (toolId: string) => void;
}

const ToolSelection: React.FC<ToolSelectionProps> = ({ onSelect }) => {
  return (
    <div className="text-center">
        <h2>Seleziona uno strumento</h2>
        <div className="grid gap-6 p-6 md:grid-cols-3">
        {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onSelect={onSelect} />
        ))}
        </div>
    </div>
  );
};

export default ToolSelection;
