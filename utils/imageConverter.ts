import path from "path";
import fs from "fs";
import sharp from "sharp";

export async function convertImage(
  inputPath: string,
  outputDir: string,
  options: { format: string; quality?: number }
): Promise<string> {
  const ext = options.format.toLowerCase();
  const baseName = path.basename(inputPath, path.extname(inputPath)); // nome senza estensione
  let outputPath = path.join(outputDir, `${baseName}.${ext}`);

  // 🔹 Controllo duplicati
  let counter = 1;
  while (fs.existsSync(outputPath)) {
    outputPath = path.join(outputDir, `${baseName} (${counter}).${ext}`);
    counter++;
  }

  // Conversione con Sharp
  try {
    const image = sharp(inputPath);

    switch (ext) {
      case "jpeg":
      case "jpg":
        await image
          .jpeg({ quality: options.quality ?? 80 })
          .toFile(outputPath);
        break;

      case "png":
        // PNG è lossless → uso compressione, non qualità
        await image
          .png({ compressionLevel: 9 })
          .toFile(outputPath);
        break;

      case "webp":
        await image
          .webp({ quality: options.quality ?? 80 })
          .toFile(outputPath);
        break;

      case "avif":
        await image
          .avif({ quality: options.quality ?? 50 }) // default 50 per AVIF
          .toFile(outputPath);
        break;

      case "tiff":
        await image
          .tiff({ quality: options.quality ?? 80 })
          .toFile(outputPath);
        break;

      default:
        throw new Error(`Formato non supportato: ${ext}`);
    }

    return outputPath;
  } catch (err) {
    console.error("Errore durante la conversione:", err);
    throw err;
  }
}
