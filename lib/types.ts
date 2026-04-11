import { MultipleChoiceData } from "@/features/cloze-generator/fileDownloader";
import z from "zod";

export const paragraphSchema = z.object({
  sentence: z
    .string()
    .min(10, "Paragraphs should be more than 10 characters long"),
});

export type TParagraphSchema = z.infer<typeof paragraphSchema>;

export type ParagraphSuccessResponse = {
  success: true;
  testData: MultipleChoiceData;
};

export const japaneseLookupSchema = z.object({
  words: z.array(z.string().trim().min(1)).min(1),
});

export type TJapaneseLookupSchema = z.infer<typeof japaneseLookupSchema>;

export type JapaneseLookupFallbackEntry = {
  headword: string;
  summary: string;
  definitions: string[];
};

export type JapaneseLookupSuccessResponse = {
  success: true;
  word: string;
  definition: string | null;
  fallbackEntries: JapaneseLookupFallbackEntry[];
};

export type JapaneseLookupErrorResponse = {
  success: false;
};

export type JapaneseLookupResponse =
  | JapaneseLookupSuccessResponse
  | JapaneseLookupErrorResponse;
