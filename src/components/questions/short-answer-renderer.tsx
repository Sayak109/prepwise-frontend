"use client";
import { useState } from "react";
import { Question } from "@/types";
import { Button } from "@/components/ui/button";
export function ShortAnswerRenderer({ question }: { question: Question }) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const correct = value.trim().toLowerCase() === question.answer.trim().toLowerCase();
  return <div className="space-y-3">
    <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Type your answer" className="w-full rounded-md border bg-background px-3 py-2" />
    <Button onClick={() => setSubmitted(true)} disabled={!value}>Submit</Button>
    {submitted ? <div className="rounded-md bg-muted p-3 text-sm"><p className={correct ? "text-green-600" : "text-red-600"}>{correct ? "Exact match" : `Not exact. Expected: ${question.answer}`}</p><p className="mt-1 text-muted-foreground">{question.explanation}</p></div> : null}
  </div>;
}
