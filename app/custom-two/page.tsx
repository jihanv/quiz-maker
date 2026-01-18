"use client"

import BackgroundImage from "@/components/backgroundImage";
import H1 from "@/components/H1";
// import ParagraphInput from "@/components/cloze-generator/clozeInput";
import CustomSelector from "@/components/custom-generator/custom-selector";
// import { useSentenceFillerStore } from "@/stores/sentenceFillerStore";



export default function Home() {

    // const text = useSentenceFillerStore((state) => state.passage)
    return (
        <>
            <div className="h-dvh flex flex-col">
                <BackgroundImage />
                <div className="z-10">
                    <H1>{"Vocabulary Test Generator"}</H1>
                    <CustomSelector />
                    {/* <ParagraphInput /> */}

                </div>
            </div>
        </>
    );
}
