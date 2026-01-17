"use client"

// import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ParagraphSuccessResponse, TParagraphSchema, paragraphSchema } from "@/lib/types";
import { downloadDocxFromItem, MultipleChoiceData } from "@/features/cloze-generator/fileDownloader";
import { UseCustomGeneratorStore } from "@/stores/custom-generator-store";

export default function CustomInput() {

    const setParagraphs = UseCustomGeneratorStore((s) => s.setParagraphs);
    const paragraphs = UseCustomGeneratorStore((s) => s.paragraphs);
    const toggleWord = UseCustomGeneratorStore((s) => s.toggleWord);
    const {
        register,
        handleSubmit,
        getValues,
        formState: {
            // errors,
            isSubmitting
        }

    } = useForm({
        resolver: zodResolver(paragraphSchema)
    });

    // The test that will be output
    // const [output, setOuput] = useState("");
    const handleNext = () => {
        const text = getValues("sentence") || "";

        // Split by blank lines (paragraph breaks)
        const rawParagraphs = text
            .trim()
            .split(/\n\s*\n+/) // one or more blank lines
            .filter(Boolean);

        let globalPosition = 0;

        const paragraphs = rawParagraphs.map((para, paragraphIndex) => {
            const words = para
                .trim()
                .split(/\s+/) // split by whitespace; commas stay attached
                .filter(Boolean)
                .map((word) => ({
                    word,
                    position: globalPosition++,
                    paragraphIndex,
                    selected: false,
                }));

            return { paragraphIndex, words };
        });

        setParagraphs(paragraphs);

    }
    const onSubmit = async (data: TParagraphSchema) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const response = await fetch("/api/cloze-generator", {
            method: "post",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            alert("Unable to create a test.")
            return
        }
        const text: ParagraphSuccessResponse = await response.json()

        const testDataToPrint: MultipleChoiceData = text.testData
        // console.log(text.testData.passage)

        // console.log(text.testData)
        await downloadDocxFromItem(testDataToPrint)

    };

    const totalWords = paragraphs.reduce((acc, p) => acc + p.words.length, 0);
    const selectedWords = paragraphs.reduce(
        (acc, p) => acc + p.words.filter(w => w.selected).length,
        0
    );

    return (
        <>
            <div
                className="flex flex-col justify-center w-3/4 max-w-5xl mx-auto px-2.5">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex flex-col gap-2 p-5 bg-white rounded-[7px]" translate="no">
                        <div className="flex flex-row gap-2">
                            {/* LEFT COLUMN: textarea + buttons */}
                            <div className=" flex flex-col lg:flex-row w-full gap-2  ">
                                <div className="rounded-[5px] border border-[#ccc] flex-1 min-w-0 overflow-hidden">
                                    <div className="flex border-[#ccc] h-full">
                                        <textarea
                                            id="message"
                                            {...register("sentence")}
                                            spellCheck="false"
                                            className="w-full border-none outline-none resize-none px-2 text-[18px] py-2.5"
                                            placeholder="Paste the article here."
                                        ></textarea>
                                    </div>
                                </div>
                                {/* RIGHT COLUMN: textarea + buttons */}
                                <div className="flex-1 min-w-0 rounded-[5px] border border-[#ccc] h-[50vh] flex flex-col overflow-hidden">
                                    <div className="flex p-2 rounded-tl-[5px] rounded-tr-[5px]  bg-accent-foreground font-bold text-white flex-row gap-2 text-[1rem] lg:text-lg shrink-0 ">
                                        <div>Paragraphs: {paragraphs.length}</div>
                                        <div>Words: {totalWords}</div>
                                        <div>Selected: {selectedWords}</div>
                                    </div>

                                    <div className=" mt-3 flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-2 ">
                                        {paragraphs.map((p) => (
                                            <p key={p.paragraphIndex} className="mb-4">
                                                {p.words.map((w) => (
                                                    <span
                                                        key={w.position}
                                                        className={`cursor-pointer text-lg font-medium px-0 rounded ${w.selected ? "bg-yellow-200" : ""
                                                            }`}
                                                        onClick={() => toggleWord(w.position)}
                                                    >
                                                        {w.word}{" "}
                                                    </span>
                                                ))}
                                            </p>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="flex gap-1 justify-center">
                            <Button
                                className="bg-black text-white transition-transform duration-150 ease-out hover:scale-[1.05] active:scale-[0.98] disabled:hover:scale-100"
                                disabled={isSubmitting}
                                type="submit"
                            >
                                Generate Test
                            </Button>

                            <Button
                                className="bg-black text-white transition-transform duration-150 ease-out hover:scale-[1.05] active:scale-[0.98] disabled:hover:scale-100"
                                disabled={isSubmitting}
                                type="button"
                                onClick={handleNext}
                            >
                                Next
                            </Button>
                        </div>
                    </div>

                </form>
                <br />
                <footer className="text-xs">© Jihan V. 2026</footer>
                <footer className="text-xs">Multiple Choice Generator</footer>
            </div>

        </>
    );
}