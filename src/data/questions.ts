import { Question } from "@/types";

export const questions: Question[] = [
  { id: "q1", topicId: "t-math", type: "MCQ", prompt: "Solve: 2x + 6 = 14", explanation: "Subtract 6 and divide by 2.", answer: "4", options: [{ id: "a", value: "2" }, { id: "b", value: "3" }, { id: "c", value: "4" }, { id: "d", value: "5" }] },
  { id: "q2", topicId: "t-math", type: "SHORT_ANSWER", prompt: "What is the value of x in x^2 = 49 (positive root)?", explanation: "Principal root of 49 is 7.", answer: "7" },
  { id: "q3", topicId: "t-geo", type: "DESCRIPTIVE", prompt: "Explain Pythagoras theorem in one paragraph.", explanation: "Used in right-angled triangles.", answer: "a2+b2=c2", sampleAnswer: "In a right triangle, square of the hypotenuse equals sum of squares of the other two sides." },
  { id: "q4", topicId: "t-phy", type: "MCQ", prompt: "SI unit of force is", explanation: "Force unit is Newton.", answer: "Newton", options: [{ id: "a", value: "Joule" }, { id: "b", value: "Newton" }, { id: "c", value: "Watt" }, { id: "d", value: "Pascal" }] },
  { id: "q5", topicId: "t-chem", type: "SHORT_ANSWER", prompt: "Name the first member of alkane series.", explanation: "CH4 is methane.", answer: "Methane" },
  { id: "q6", topicId: "t-eng", type: "DESCRIPTIVE", prompt: "How do you infer author tone from context?", explanation: "Use clue words and sentence framing.", answer: "context clues", sampleAnswer: "Read adjective choices, punctuation, and contrast markers to identify the author tone." },
  { id: "q7", topicId: "t-geo", type: "MCQ", prompt: "Angles in a triangle add up to", explanation: "Sum is always 180 degrees.", answer: "180", options: [{ id: "a", value: "90" }, { id: "b", value: "180" }, { id: "c", value: "360" }, { id: "d", value: "270" }] },
  { id: "q8", topicId: "t-phy", type: "SHORT_ANSWER", prompt: "State Newton's second law formula.", explanation: "Force equals mass times acceleration.", answer: "F=ma" },
  { id: "q9", topicId: "t-eng", type: "MCQ", prompt: "Antonym of 'brief'", explanation: "Opposite is lengthy/long.", answer: "Long", options: [{ id: "a", value: "Tiny" }, { id: "b", value: "Short" }, { id: "c", value: "Long" }, { id: "d", value: "Fast" }] },
  { id: "q10", topicId: "t-chem", type: "DESCRIPTIVE", prompt: "Why are isomers important?", explanation: "Same formula, different structures lead to different properties.", answer: "different structures", sampleAnswer: "Isomers matter because compounds with the same molecular formula can have different physical and chemical properties due to structural arrangement." },
];
