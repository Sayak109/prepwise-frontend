"use client";
import { useState } from "react";
import { Question } from "@/types";
import { Button } from "@/components/ui/button";
export function MCQRenderer({ question }: { question: Question }) {
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const correct = selected.trim().toLowerCase() === question.answer.trim().toLowerCase();
  return <div className="space-y-3">
    {question.options?.map((opt) => <label key={opt.id} className="flex gap-2 rounded-md border p-2 cursor-pointer"><input type="radio" name={question.id} value={opt.value} onChange={(e) => setSelected(e.target.value)} /><span>{opt.value}</span></label>)}
    <Button onClick={() => setSubmitted(true)} disabled={!selected}>Submit</Button>
    {submitted ? <div className="rounded-md bg-muted p-3 text-sm"><p className={correct ? "text-green-600" : "text-red-600"}>{correct ? "Correct answer" : `Incorrect. Correct: ${question.answer}`}</p><p className="mt-1 text-muted-foreground">{question.explanation}</p></div> : null}
  </div>;
}
