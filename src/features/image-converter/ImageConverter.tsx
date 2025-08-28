import React, { useState, useCallback, useEffect } from "react";

const ImageConverter: React.FC = () => {
  const [filePath, setFilePath] = useState<string | null>(null);
  const [sourceFormat, setSourceFormat] = useState<string>("");
  const [targetFormat, setTargetFormat] = useState<string>("png");
  const [quality, setQuality] = useState<number>(80);
  const [result, setResult] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  const outputFormats = ["png", "jpeg", "webp", "avif", "tiff"];
  const supportsQuality = ["jpeg", "webp", "avif", "tiff"];

  // Selezione file tramite dialog
  const handleSelectFile = async () => {
    const path = await window.electronAPI.selectImage();
    if (!path) return;
    setFilePath(path);
    const ext = path.split(".").pop();
    setSourceFormat(ext ?? "");
  };

  // Drag & Drop events
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    // 🔹 Passiamo il path al preload
    window.electronAPI.handleDroppedFile(files[0].path);
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  // 🔹 Ascoltiamo l'evento CustomEvent dal preload
  useEffect(() => {
    const listener = (e: any) => {
      const path = e.detail as string | null;
      if (!path) return;
      setFilePath(path);
      const ext = path.split(".").pop();
      setSourceFormat(ext ?? "");
    };
    window.addEventListener("file-dropped", listener);
    return () => window.removeEventListener("file-dropped", listener);
  }, []);

  // Conversione immagine
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
        Trascina un’immagine qui o clicca per selezionarla e convertila in un altro formato.
      </p>

      {/* Drag & Drop Area */}
      <div
        className={`mt-6 border-2 border-dashed rounded-lg p-12 cursor-pointer transition-colors
          ${isDragging ? "border-blue-400 bg-white/10" : "border-gray-600 bg-black/20"}
          hover:border-blue-400 hover:bg-white/10`}
        onClick={handleSelectFile}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {filePath ? (
          <p className="break-words">{filePath}</p>
        ) : (
          <p className="text-gray-400">Trascina qui o clicca per selezionare</p>
        )}
      </div>

      {/* Info formato sorgente */}
      {filePath && (
        <p className="mt-4 text-gray-200">
          Formato rilevato: <strong>{sourceFormat}</strong>
        </p>
      )}

      {/* Select formato destinazione */}
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

      {/* Slider qualità se supportato */}
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

      {/* Risultato */}
      {result && (
        <div className="mt-4 text-green-400 break-words">
          ✅ File convertito e salvato in: <br />
          <span className="font-mono">{result}</span>
          <div className="mt-2">
            <button
              onClick={() => window.electronAPI.openPath(result)}
              className="px-4 py-1 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
            >
              Apri cartella
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageConverter;
