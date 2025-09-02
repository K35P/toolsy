import path from "path";
import fs from "fs";
import sharp from "sharp";

export async function convertImage(
  inputPath: string,
  outputDir: string,
  options: { format: string; quality?: number }
): Promise<string> {
  const ext = options.format.toLowerCase();
  const baseName = path.basename(inputPath, path.extname(inputPath)); // name without extension
  let outputPath = path.join(outputDir, `${baseName}.${ext}`);

  // Check for duplicates
  let counter = 1;
  while (fs.existsSync(outputPath)) {
    outputPath = path.join(outputDir, `${baseName} (${counter}).${ext}`);
    counter++;
  }

  // Conversion with Sharp
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
        // PNG is lossless -> use compression, not quality
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
          .avif({ quality: options.quality ?? 50 }) // default 50 for AVIF
          .toFile(outputPath);
        break;

      case "tiff":
        await image
          .tiff({ quality: options.quality ?? 80 })
          .toFile(outputPath);
        break;

      default:
        throw new Error(`Format not supported: ${ext}`);
    }

    return outputPath;
  } catch (err) {
    console.error("Error during conversion:", err);
    throw err;
  }
}
