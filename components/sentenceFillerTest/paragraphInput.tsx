"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ParagraphSuccessResponse, TParagraphSchema, paragraphSchema } from "@/lib/types";

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
    const [output, setOuput] = useState("");

    const onSubmit = async (data: TParagraphSchema) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const response = await fetch("/api/sentenceFiller", {
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
    };
    return (
        <>
            <div
                className="flex flex-col w-3/4 2xl:w-275 mx-auto px-2.5">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex flex-col gap-2 p-5 bg-white rounded-[7px]" translate="no">
                        <div className="rounded-[5px] border border-[#ccc]">
                            <div className="flex border-b border-[#ccc]">
                                <textarea
                                    id="message"
                                    {...register("sentence")}
                                    spellCheck="false"
                                    className=" h-[50vh] border-none outline-none resize-none bg-none text-[18px] px-3.75 py-2.5 "
                                    placeholder="Paste the article here."
                                    maxLength={500}
                                ></textarea>
                            </div>
                        </div>
                        <Button className="bg-black text-white" disabled={isSubmitting}>
                            Generate Test
                        </Button>

                    </div>
                </form>
            </div>
            {console.log(output)}
        </>
    );
}