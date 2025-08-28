import React, { useState } from "react";
import HeroSection from "./components/HeroSection";
import ImageConverter from "@/features/image-converter/ImageConverter";
import ToolSelection from "@/components/ToolSelection";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const Home: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const renderTool = () => {
    switch (selectedTool) {
      case "image":
        return <ImageConverter />;
      case "document":
        return "Document converter";
      case "video":
        return "Video converter";
      default:
        return <ToolSelection onSelect={setSelectedTool} />;
    }
  };

  return (
    <div className="h-auto">
      {/* <HeroSection />
      <hr className="border border-white/5 my-10" /> */}
      {selectedTool !== null && (
        <div className="btn-primary">
          <ArrowLeftIcon className="size-5 cursor-pointer" title="Torna indietro" onClick={() => setSelectedTool(null)}/>
        </div>
      )}
      {renderTool()}
    </div>
  );
};

export default Home;
