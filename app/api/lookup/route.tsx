export const runtime = "nodejs";

import { japaneseLookupSchema } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body: unknown = await request.json();
    const result = japaneseLookupSchema.safeParse(body)

    if (!result.success) return NextResponse.json({ success: false }, { status: 400 })

    const [firstWord] = result.data.words;
    const url = `https://api.excelapi.org/dictionary/enja?word=${encodeURIComponent(firstWord)}`;
    const response = await fetch(url, { headers: { Accept: "text/plain", "User-Agent": "Mozilla/5.0" } });
    const text = await response.text();
    return new NextResponse(text, {
        status: response.status,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
}