"use server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";

export async function extractTextFromPDF(file: File | string): Promise<string> {
  const loader = new PDFLoader(file);
  const docs = await loader.load();
  return docs.map((doc) => doc.pageContent).join("\n");
}

export async function extractTextFromDOCX(
  file: File | string
): Promise<string> {
  const loader = new DocxLoader(file);
  const docs = await loader.load();
  return docs.map((doc) => doc.pageContent).join("\n");
}

export async function extractTextFromDOC(file: File | string): Promise<string> {
  const loader = new DocxLoader(file, {
    type: "doc",
  });
  const docs = await loader.load();
  return docs.map((doc) => doc.pageContent).join("\n");
}
