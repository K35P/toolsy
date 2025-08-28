import React from "react";
import { Tool } from "@/types/tool";


interface ToolCardProps {
  tool: Tool;
  onSelect: (id: string) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(tool.id)}
      className="cursor-pointer rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-sm p-6 text-center shadow-sm transition"
    >
      <div className="mb-4 flex justify-center text-green-300">{tool.icon}</div>
      <h2 className="text-lg font-semibold">{tool.name}</h2>
      <p className="mt-2 text-sm text-gray-500">{tool.description}</p>
    </div>
  );
};

export default ToolCard;
