"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ParagraphSuccessResponse, TParagraphSchema, paragraphSchema } from "@/lib/types";
import { downloadDocxFromItem } from "@/features/multipleChoiceVocabulary/fileDownloader";
// import { downloadFile } from "@/testfolder/documentcreator";

type ParagraphInputProps = {
    apiId: string
}

export default function ParagraphInput({ apiId }: ParagraphInputProps) {

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
    const [output, setOuput] = useState("");

    const onSubmit = async (data: TParagraphSchema) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const response = await fetch(apiId, {
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
        setOuput(`${text.test}`)

        if (apiId === "/api/multipleChoiceVocabulary") {
            console.log(item)
            await downloadDocxFromItem()

        }
        else console.log("HI")
    };
    return (
        <>
            <div
                className="flex flex-col w-3/4 max-w-5xl mx-auto px-2.5">
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
                        <Button className="bg-black text-white" disabled={isSubmitting}>
                            Generate Test
                        </Button>

                    </div>
                </form>
            </div>
            {/* {console.log(output)} */}
        </>
    );
}

const item = {
    passage: `President Donald Trump says the US needs to "own" Greenland to prevent Russia and China from doing so.

"Countries have to have ownership and you defend ownership, you don't defend [1]. And we'll have to defend Greenland," Trump told [2] on Friday, in response to a question from the BBC.

We will do it "the easy way" or "the hard way", he added. The White House said recently the administration is considering buying the semi-autonomous territory of fellow Nato member Denmark, but it would not rule out the option of [3] it by force.

Denmark and Greenland say the territory is not for sale. Denmark has said military action would [4] the end of the trans-Atlantic defence alliance.`,
    questions: [
        {
            choices: ["heartbeats", "volatilities", "Chinese", "leases"],
            answer: 3
        },
        {
            choices: ["professors", "reporters", "proprietorships", "reassessments"],
            answer: 1
        },
        {
            choices: ["annexing", "stifling", "broiling", "dressing"],
            answer: 0
        },
        {
            choices: ["spell", "bereaved", "unsung", "effeminate"],
            answer: 0
        }
    ]
};