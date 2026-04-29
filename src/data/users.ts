import { User } from "@/types";

export const users: User[] = [
  { id: "u-admin", name: "Admin One", email: "admin@prepwise.com", role: "ADMIN", premium: true },
  { id: "u-editor-1", name: "Editor A", email: "editor1@prepwise.com", role: "EDITOR", premium: true },
  { id: "u-editor-2", name: "Editor B", email: "editor2@prepwise.com", role: "EDITOR", premium: true },
  { id: "u-student-1", name: "Aarav", email: "student1@prepwise.com", role: "STUDENT", premium: false },
  { id: "u-student-2", name: "Maya", email: "student2@prepwise.com", role: "STUDENT", premium: true },
  { id: "u-student-3", name: "Ishan", email: "student3@prepwise.com", role: "STUDENT", premium: false },
  { id: "u-student-4", name: "Sara", email: "student4@prepwise.com", role: "STUDENT", premium: false },
  { id: "u-student-5", name: "Kabir", email: "student5@prepwise.com", role: "STUDENT", premium: true },
];
