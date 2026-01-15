"use client"

// import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ParagraphSuccessResponse, TParagraphSchema, paragraphSchema } from "@/lib/types";
import { downloadDocxFromItem, MultipleChoiceData } from "@/features/cloze-generator/fileDownloader";
import { UseCustomGeneratorStore } from "@/stores/custom-generator-store";
// import { UseCustomGeneratorStore } from "@/stores/custom-generator-store";



export default function CustomInput() {

    // const setWords = UseCustomGeneratorStore((state) => state.setWords);
    // const toggleWord = UseCustomGeneratorStore((state) => state.toggleWord);
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* LEFT COLUMN: textarea + buttons */}
                            <div>
                                <div className="rounded-[5px] border border-[#ccc]">
                                    <div className="flex border-b border-[#ccc]">
                                        <textarea
                                            id="message"
                                            {...register("sentence")}
                                            spellCheck="false"
                                            className="h-[50vh] w-full border-none outline-none resize-none px-2 text-[18px] py-2.5"
                                            placeholder="Paste the article here."
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="flex gap-1 justify-center mt-3">
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

                            {/* RIGHT COLUMN: preview */}

                            <div className="p-4 border rounded max-h-[50vh] overflow-auto">
                                <div className="flex gap-2 text-sm">
                                    <div>Paragraphs: {paragraphs.length}</div>
                                    <div>Words: {totalWords}</div>
                                    <div>Selected: {selectedWords}</div>
                                </div>

                                {paragraphs.map((p) => (
                                    <p key={p.paragraphIndex} className="mb-4">
                                        {p.words.map((w) => (
                                            <span
                                                key={w.position}
                                                className={`cursor-pointer text-lg font-bold px-0.5 rounded ${w.selected ? "bg-yellow-200" : ""
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
                </form>

            </div>

        </>
    );
}