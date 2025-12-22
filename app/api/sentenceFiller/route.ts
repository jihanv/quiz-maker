import { TParagraphSchema, paragraphSchema } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body: unknown = await request.json();

  const result = paragraphSchema.safeParse(body);

  let zodErrors = {};

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });
    return NextResponse.json(
      {
        success: false,
        errors: zodErrors,
      },
      { status: 400 }
    );
  }

  const data: TParagraphSchema = result.data;

  const test = data.sentence.toUpperCase();

  // translate
  return NextResponse.json(
    Object.keys(zodErrors).length > 0
      ? { errors: zodErrors }
      : {
          success: true,
          test: test,
        }
  );
}
