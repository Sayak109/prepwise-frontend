import { Topic } from "@/types";

export const topics: Topic[] = [
  { id: "t-math", title: "Algebra", description: "Linear equations and expressions", premium: false, editorIds: ["u-editor-1"], weakForUsers: ["u-student-1", "u-student-3"] },
  { id: "t-geo", title: "Geometry", description: "Triangles, circles and mensuration", premium: false, editorIds: ["u-editor-2"], weakForUsers: ["u-student-4"] },
  { id: "t-phy", title: "Physics Mechanics", description: "Motion, force and work", premium: true, editorIds: ["u-editor-1"], weakForUsers: ["u-student-1", "u-student-5"] },
  { id: "t-chem", title: "Organic Chemistry", description: "Hydrocarbons and reactions", premium: true, editorIds: ["u-editor-2"], weakForUsers: ["u-student-2"] },
  { id: "t-eng", title: "English Comprehension", description: "Reading and inference skills", premium: false, editorIds: ["u-editor-1", "u-editor-2"], weakForUsers: ["u-student-3"] },
];
