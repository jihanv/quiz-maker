"use client"

// import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ParagraphSuccessResponse, TParagraphSchema, paragraphSchema } from "@/lib/types";
import { downloadDocxFromItem, MultipleChoiceData } from "@/features/clozeGenerator/fileDownloader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"



export default function ParagraphInput() {

    const {
        register,
        handleSubmit,
        formState: {
            // errors,
            isSubmitting
        }

    } = useForm({
        resolver: zodResolver(paragraphSchema)
    });

    // The test that will be output
    // const [output, setOuput] = useState("");

    const onSubmit = async (data: TParagraphSchema) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const response = await fetch("/api/clozeGenerator", {
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
        console.log(text.testData.passage)

        console.log(text.testData)
        await downloadDocxFromItem(testDataToPrint)

    };
    return (
        <>

            <div
                className="flex flex-col justify-center w-3/4 max-w-5xl mx-auto px-2.5">
                <Tabs defaultValue="account" className="flex flex-col items-center ">
                    <TabsList>
                        <TabsTrigger value="account">Auto-Generate</TabsTrigger>
                        <TabsTrigger value="password">Custom</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">Make changes to your account here.</TabsContent>
                    <TabsContent value="password">Change your password here.</TabsContent>
                </Tabs>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex flex-col gap-2 p-5 bg-white rounded-[7px]" translate="no">
                        <div className="rounded-[5px] border border-[#ccc]">
                            <div className="flex border-b border-[#ccc]">
                                <textarea
                                    id="message"
                                    {...register("sentence")}
                                    spellCheck="false"
                                    className=" h-[50vh] w-full border-none outline-none resize-none px-2 text-[18px] py-2.5 "
                                    placeholder="Paste the article here."
                                ></textarea>
                            </div>
                        </div>
                        <div className="flex gap-1 justify-center">
                            <Button className="bg-black text-white transition-transform duration-150 ease-out hover:scale-[1.05] active:scale-[0.98] disabled:hover:scale-100" disabled={isSubmitting} type="submit">
                                Generate Test
                            </Button>
                            <Button className="bg-black text-white transition-transform duration-150 ease-out hover:scale-[1.05] active:scale-[0.98] disabled:hover:scale-100" disabled={isSubmitting} type="button" onClick={() => { console.log("BIE") }}>
                                Bye
                            </Button>
                        </div>


                    </div>
                </form>
            </div>
        </>
    );
}