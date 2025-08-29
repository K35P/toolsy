import { CheckIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

const ImageConverter: React.FC = () => {
  const [filePath, setFilePath] = useState<string | null>(null);
  const [sourceFormat, setSourceFormat] = useState<string>("");
  const [targetFormat, setTargetFormat] = useState<string>("png");
  const [quality, setQuality] = useState<number>(80);
  const [result, setResult] = useState<string>("");

  const outputFormats = ["png", "jpeg", "webp", "avif", "tiff"];
  const supportsQuality = ["jpeg", "webp", "avif", "tiff"];

  // Select file through dialog
  const handleSelectFile = async () => {
    const path = await window.electronAPI.selectImage();
    if (!path) return;
    setFilePath(path);
    const ext = path.split(".").pop();
    setSourceFormat(ext ?? "");
  };

  // Image conversion
  const handleConvert = async () => {
    if (!filePath) return;

    await window.electronAPI.ensureConversionsDir();

    const output = await window.electronAPI.convertImage(
      filePath,
      targetFormat,
      quality
    );
    setResult(output);
  };

  return (
    <div className="p-6 text-center max-w-lg mx-auto text-white">
      <h1 className="text-3xl font-bold">Image Converter</h1>
      <p className="mt-2 text-gray-300">
        Clicca per selezionare un'immagine e convertila in un altro formato.
      </p>

      {/* File Selection Area */}
      <div 
        className="mt-6 border-2 border-dashed rounded-lg p-12 cursor-pointer transition-colors border-gray-600 bg-black/20 hover:border-green-300 hover:bg-white/10" 
        onClick={handleSelectFile}
      >
        {filePath ? (
          <p className="break-words">{filePath}</p>
        ) : (
          <p className="text-gray-400">Clicca per selezionare un'immagine</p>
        )}
      </div>

      {/* Info source format */}
      {filePath && (
        <p className="mt-4 text-gray-200">
          Formato rilevato: <strong>{sourceFormat}</strong>
        </p>
      )}

      {/* Select destination format */}
      {filePath && (
        <div className="mt-4 flex justify-center items-center gap-2">
          <label>Converti in:</label>
          <select
            value={targetFormat}
            onChange={(e) => setTargetFormat(e.target.value)}
            className="border rounded p-2 bg-gray-800 text-white border-gray-600"
          >
            {outputFormats.map((fmt) => (
              <option key={fmt} value={fmt}>{fmt.toUpperCase()}</option>
            ))}
          </select>
        </div>
      )}

      {/* Slider quality if supported */}
      {filePath && supportsQuality.includes(targetFormat) && (
        <div className="mt-4 flex justify-center items-center gap-2">
          <label>Qualità: {quality}</label>
          <input
            type="range"
            min={1}
            max={100}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="accent-blue-500"
          />
        </div>
      )}

      {/* CTA Convert */}
      {filePath && (
        <div className="mt-6">
          <button
            onClick={handleConvert}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700 transition-colors"
          >
            Converti
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-4 break-words">
          <div className="bg-green-300/10 text-green-300 rounded rounded-xl flex flex-col items-center justify-start">
            <span><CheckIcon className="size-4" /> File convertito e salvato in: <br /></span>
            <small className="font-mono">{result}</small>
          </div>
          <div className="mt-2">
            <button onClick={() => window.electronAPI.openPath(result)} >Apri cartella</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageConverter;
