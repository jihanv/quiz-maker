"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JapaneseLookupResponse, ParagraphSuccessResponse, TParagraphSchema, VocabularyDictionaryEntry, paragraphSchema } from "@/lib/types";
import { downloadDocxFromItem, MultipleChoiceData } from "@/features/cloze-generator/fileDownloader";
import {
    downloadVocabularyDictionaryDocx,
    getUniqueAlphabetizedChoiceWords,
} from "@/features/cloze-generator/vocabularyDownloader";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"


export default function ParagraphInput() {

    const {
        register,
        handleSubmit,
        watch,
        formState: {
            // errors,
            isSubmitting
        }

    } = useForm({
        resolver: zodResolver(paragraphSchema)
    });

    const [generatedTestData, setGeneratedTestData] = useState<MultipleChoiceData | null>(null);
    const [generatedVocabularyEntries, setGeneratedVocabularyEntries] = useState<VocabularyDictionaryEntry[]>([]);
    const [isGeneratingVocabularyDictionary, setIsGeneratingVocabularyDictionary] = useState(false);
    const [lastGeneratedSentence, setLastGeneratedSentence] = useState("");
    const currentSentence = watch("sentence") ?? "";
    const hasInputChangedSinceLastGeneration = currentSentence !== lastGeneratedSentence;

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

        const testDataToPrint: MultipleChoiceData = text.testData;
        setGeneratedTestData(testDataToPrint);
        setLastGeneratedSentence(data.sentence);
        await downloadDocxFromItem(testDataToPrint)

    };

    const handleVocabularyDictionaryClick = async () => {
        if (!generatedTestData) return;
        setIsGeneratingVocabularyDictionary(true);
        const lookupRows = generatedTestData.questions.map((q) => ({ word: q.choices[q.answer], partOfSpeech: q.partOfSpeech })).filter((row) => row.partOfSpeech);
        const dictionaryEntries: VocabularyDictionaryEntry[] = [];
        for (const row of lookupRows) {
            const response = await fetch("/api/lookup", { method: "post", body: JSON.stringify(row), headers: { "Content-Type": "application/json" } });
            if (!response.ok) continue;
            const lookupResult: JapaneseLookupResponse = await response.json();
            if (lookupResult.success) dictionaryEntries.push({ word: row.word, partOfSpeech: row.partOfSpeech!, definition: lookupResult.definition, fallbackEntries: lookupResult.fallbackEntries });
        }
        setGeneratedVocabularyEntries(dictionaryEntries);
        await downloadVocabularyDictionaryDocx(dictionaryEntries);
        setIsGeneratingVocabularyDictionary(false);
    };

    const handleFullVocabularyDictionaryClick = () => {
        if (!generatedTestData) return;
        const fullWordList = getUniqueAlphabetizedChoiceWords(generatedTestData);
        alert(`Found ${fullWordList.length} unique words.`);
    };

    return (
        <>
            <div
                className="flex flex-col justify-center w-3/4 max-w-5xl mx-auto px-2.5">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex flex-col gap-2 p-5 bg-white rounded-[7px]" translate="no">
                        <div className="rounded-[5px] border border-[#ccc]">
                            <div className="flex border-[#ccc]">
                                <textarea
                                    id="message"
                                    {...register("sentence")}
                                    spellCheck="false"
                                    className=" h-[50vh] w-full border-none outline-none resize-none px-2 text-[18px] py-2.5 "
                                    placeholder="Paste the article here."
                                ></textarea>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-center">
                            <Button className="bg-black text-white transition-transform duration-150 ease-out hover:scale-[1.05] active:scale-[0.98] disabled:hover:scale-100" disabled={isSubmitting} type="submit">
                                Generate Test
                            </Button>
                            <Button
                                className="bg-black text-white transition-transform duration-150 ease-out hover:scale-[1.05] active:scale-[0.98] disabled:hover:scale-100"
                                disabled={
                                    isSubmitting ||
                                    isGeneratingVocabularyDictionary ||
                                    !generatedTestData ||
                                    hasInputChangedSinceLastGeneration
                                }
                                onClick={handleVocabularyDictionaryClick}
                                type="button"
                                variant="outline"
                            >
                                Generate Vocabulary Dictionary
                            </Button>
                            <Button
                                disabled={isSubmitting || isGeneratingVocabularyDictionary || !generatedTestData}
                                onClick={handleFullVocabularyDictionaryClick}
                                type="button"
                                variant="outline"
                            >
                                Generate Full Vocabulary Dictionary
                            </Button>
                        </div>
                    </div>
                </form>
                <br />
                <footer className="text-xs">© Jihan V. 2026</footer>
                <footer className="text-xs">Multiple Choice Generator</footer>
                <Dialog open={isSubmitting || isGeneratingVocabularyDictionary}>
                    <DialogContent
                        className="sm:max-w-md"
                        // hides the X button (DialogContent renders a close button by default)
                        // if your shadcn version supports it:
                        // closeButton={false}
                        onPointerDownOutside={(e) => e.preventDefault()}
                        onEscapeKeyDown={(e) => e.preventDefault()}
                    >
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                {isGeneratingVocabularyDictionary ? "Generating vocabulary dictionary…" : "Generating test…"}
                            </DialogTitle>
                            <DialogDescription>
                                {isGeneratingVocabularyDictionary
                                    ? "Please wait—don’t close this tab/window while we build your vocabulary dictionary. 単語帳を作成中です。完了するまでこのタブ／ウィンドウは閉じないでください（切り替えはOKです）。"
                                    : "Please wait—don’t close this tab/window while we build your test document. テスト文書を作成中です。完了するまでこのタブ／ウィンドウは閉じないでください（切り替えはOKです）。"}
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div >

        </>
    );
}