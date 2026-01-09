import z from "zod";

export const paragraphSchema = z.object({
  sentence: z
    .string()
    .min(10, "Paragraphs should be more than 10 characters long"),
});

export type TParagraphSchema = z.infer<typeof paragraphSchema>;

export type ParagraphSuccessResponse = {
  success: true;
  test: string;
};
