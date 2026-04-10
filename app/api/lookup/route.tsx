export const runtime = "nodejs";

import { japaneseLookupSchema } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body: unknown = await request.json();
    const result = japaneseLookupSchema.safeParse(body)

    if (!result.success) return NextResponse.json({ success: false }, { status: 400 })

    return NextResponse.json({ success: true, words: result.data.words })
}