"use client"

import BackgroundImage from "@/components/backgroundImage";
import H1 from "@/components/H1";
import ParagraphInput from "@/components/sentenceFillerTest/paragraphInput";
import { useSentenceFillerStore } from "@/stores/sentenceFillerStore";

export default function Home() {

  const text = useSentenceFillerStore((state) => state.passage)

  return (
    <>
      <div className="h-dvh flex flex-col bg-gray-200">
        <BackgroundImage />
        <div className="z-10">
          <H1>{text}</H1>
          <ParagraphInput />
        </div>

      </div>
    </>
  );
}
