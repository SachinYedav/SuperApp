import { PDFDocument, degrees, rgb } from "pdf-lib";
import JSZip from "jszip";
import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// Worker setup (Vite compatible)
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

/* ----------------------------------------------------
   LOGGER
---------------------------------------------------- */
const log = (...args) => console.log("[PDF-TOOL]", ...args);
const logError = (...args) => console.error("[PDF-TOOL ERROR]", ...args);


/* ----------------------------------------------------
   1. EXTRACT PAGES (HIGH QUALITY THUMBNAILS)
---------------------------------------------------- */
export const extractPages = async (files) => {
  const allPages = [];

  for (const file of files) {
    if (!file || !file.size) {
      log("Skipping invalid file");
      continue;
    }

    try {
      log("Processing file:", file.name);

      // ---------- PDF ----------
      if (file.type === "application/pdf") {
        const buffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(buffer).promise;

        log(`PDF Loaded: ${file.name}, Pages: ${pdf.numPages}`);

        for (let i = 1; i <= pdf.numPages; i++) {
          try {
            const page = await pdf.getPage(i);

            // High quality thumbnail
            const viewport = page.getViewport({
              scale: Math.max(2, window.devicePixelRatio || 1),
            });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({
              canvasContext: context,
              viewport,
            }).promise;

            const blob = await new Promise((resolve) =>
              canvas.toBlob(resolve, "image/jpeg", 0.95)
            );

            const src = URL.createObjectURL(blob);

            allPages.push({
              id: crypto.randomUUID(),
              src,
              file,
              pageIndex: i - 1,
              type: "pdf",
              rotation: 0,
              selected: false,
            });

            // cleanup
            canvas.width = 0;
            canvas.height = 0;

          } catch (pageErr) {
            logError(`Failed rendering page ${i}`, pageErr);
          }
        }
      }

      // ---------- IMAGE ----------
      else if (file.type.startsWith("image/")) {
        const src = URL.createObjectURL(file);

        allPages.push({
          id: crypto.randomUUID(),
          src,
          file,
          type: "image",
          rotation: 0,
          selected: false,
        });

        log("Image loaded:", file.name);
      }

    } catch (err) {
      logError("File processing failed:", file.name, err);
    }
  }

  return allPages;
};


/* ----------------------------------------------------
   2. GENERATE PDF 
---------------------------------------------------- */
export const generatePDF = async (
  pages,
  settings = { margin: 20 }
) => {
  log("Generating PDF...");
  console.time("PDF generation");

  const pdfDoc = await PDFDocument.create();
  const pdfCache = new Map();
  const margin = settings.margin || 20;

  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];

    try {
      let embedded;
      let width, height;

      // ---------- IMAGE ----------
      if (p.type === "image") {
        const imgBytes = await p.file.arrayBuffer();

        log("Embedding image size:", imgBytes.byteLength);

        embedded =
          p.file.type === "image/png"
            ? await pdfDoc.embedPng(imgBytes)
            : await pdfDoc.embedJpg(imgBytes);

        width = embedded.width;
        height = embedded.height;
      }

      // ---------- PDF ----------
      else {
        let srcDoc;

        if (pdfCache.has(p.file)) {
          srcDoc = pdfCache.get(p.file);
        } else {
          srcDoc = await PDFDocument.load(await p.file.arrayBuffer());
          pdfCache.set(p.file, srcDoc);
        }

        const [embeddedPage] = await pdfDoc.embedPdf(srcDoc, [p.pageIndex]);
        embedded = embeddedPage;
        width = embedded.width;
        height = embedded.height;
      }

      // Orientation detect
      const isLandscape = width > height;

      const pageWidth = isLandscape ? 841.89 : 595.28;
      const pageHeight = isLandscape ? 595.28 : 841.89;

      const currentPage = pdfDoc.addPage([pageWidth, pageHeight]);

      // Scale to fit width (better quality look)
      const scale = (pageWidth - margin * 2) / width;

      const finalW = width * scale;
      const finalH = height * scale;

      const x = (pageWidth - finalW) / 2;
      const y = (pageHeight - finalH) / 2;

      if (p.type === "image") {
        currentPage.drawImage(embedded, {
          x,
          y,
          width: finalW,
          height: finalH,
          rotate: degrees((p.rotation || 0) % 360),
        });
      } else {
        currentPage.drawPage(embedded, {
          x,
          y,
          width: finalW,
          height: finalH,
          rotate: degrees((p.rotation || 0) % 360),
        });
      }

    } catch (err) {
      logError(`Page ${i + 1} failed`, err);
    }
  }

  const pdfBytes = await pdfDoc.save();

  console.timeEnd("PDF generation");
  log("PDF generated successfully");

  return new Blob([pdfBytes], { type: "application/pdf" });
};


/* ----------------------------------------------------
   3. GENERATE IMAGES ZIP (HD EXPORT)
---------------------------------------------------- */
export const generateImagesZip = async (pages) => {
  log("Generating ZIP...");

  const zip = new JSZip();
  const folder = zip.folder("images");

  if (!folder) throw new Error("ZIP folder creation failed");

  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];

    try {
      if (p.type === "image") {
        folder.file(`image-${i + 1}.jpg`, p.file);
      } else {
        const buffer = await p.file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(buffer).promise;
        const page = await pdf.getPage(p.pageIndex + 1);

        // High resolution export
        const viewport = page.getViewport({ scale: 3 });

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext("2d");

        await page.render({
          canvasContext: ctx,
          viewport,
        }).promise;

        const blob = await new Promise((r) =>
          canvas.toBlob(r, "image/jpeg", 0.98)
        );

        folder.file(`page-${i + 1}.jpg`, blob);

        canvas.width = 0;
        canvas.height = 0;
      }
    } catch (err) {
      logError(`ZIP page ${i + 1} failed`, err);
    }
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  log("ZIP generated");

  return zipBlob;
};
