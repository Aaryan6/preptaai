"use server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function extractTextFromPDF(file: File | string): Promise<string> {
  const loader = new PDFLoader(file);
  const docs = await loader.load();
  return docs.map((doc) => doc.pageContent).join("\n");
}
