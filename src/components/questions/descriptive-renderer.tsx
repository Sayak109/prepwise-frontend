"use client";
import { useState } from "react";
import { Question } from "@/types";
import { Button } from "@/components/ui/button";
export function DescriptiveRenderer({ question }: { question: Question }) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return <div className="space-y-3">
    <textarea value={value} onChange={(e) => setValue(e.target.value)} rows={5} placeholder="Write your detailed answer" className="w-full rounded-md border bg-background px-3 py-2" />
    <Button onClick={() => setSubmitted(true)} disabled={!value}>Submit</Button>
    {submitted ? <div className="rounded-md bg-muted p-3 text-sm"><p className="font-medium">Sample answer:</p><p className="mt-1 text-muted-foreground">{question.sampleAnswer ?? question.answer}</p><p className="mt-2 text-muted-foreground">{question.explanation}</p></div> : null}
  </div>;
}
