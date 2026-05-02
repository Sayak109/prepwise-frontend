import mongoose from "mongoose";
import {
  Answer,
  Bookmark,
  EditorTopicPermission,
  McqOption,
  Question,
  Test,
  TestAttempt,
  TestAttemptQuestionState,
  TestQuestion,
  Topic,
  UserProgress,
} from "@/server/models";
import { connectDb } from "@/server/db";
import { exams, extraQuestionsByTopic, topics } from "@/server/seed-data";

type Difficulty = "EASY" | "MEDIUM" | "HARD";
type QuestionType = "MCQ" | "SHORT_ANSWER" | "DESCRIPTIVE";

type McqSeed = {
  questionText: string;
  difficulty: Difficulty;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type ShortSeed = {
  questionText: string;
  difficulty: Difficulty;
  correctAnswer: string;
  explanation: string;
};

type TopicSeed = {
  title: string;
  slug: string;
  description: string;
  mcqs: McqSeed[];
  shorts: ShortSeed[];
};

type ExamSeed = {
  title: string;
  difficulty: Difficulty;
  questionCount: number;
  durationSeconds: number;
  topicSlugs?: string[];
  questionType?: QuestionType;
  questionDifficulty?: Difficulty;
};

async function resetContentData() {
  await Answer.deleteMany();
  await TestAttemptQuestionState.deleteMany();
  await TestAttempt.deleteMany();
  await TestQuestion.deleteMany();
  await Test.deleteMany();
  await Bookmark.deleteMany();
  await UserProgress.deleteMany();
  await EditorTopicPermission.deleteMany();
  await McqOption.deleteMany();
  await Question.deleteMany();
  await Topic.deleteMany();

  console.log("Cleared old topic, question, test, and attempt data.");
}

async function seedQuestions(topicId: string, mcqs: McqSeed[], shorts: ShortSeed[]) {
  for (const questionSeed of mcqs) {
    const question = await Question.create({
      topicId,
      type: "MCQ",
      questionText: questionSeed.questionText,
      difficulty: questionSeed.difficulty,
      explanation: questionSeed.explanation,
      isPremium: false,
    });

    let correctOptionId: string | undefined;
    for (const [index, optionText] of questionSeed.options.entries()) {
      const option = await McqOption.create({
        questionId: question.id,
        optionText,
        displayOrder: index,
      });

      if (index === questionSeed.correctIndex) {
        correctOptionId = option.id;
      }
    }

    await Question.findByIdAndUpdate(question.id, { correctOptionId });
  }

  for (const questionSeed of shorts) {
    await Question.create({
      topicId,
      type: "SHORT_ANSWER",
      questionText: questionSeed.questionText,
      difficulty: questionSeed.difficulty,
      explanation: questionSeed.explanation,
      correctAnswer: questionSeed.correctAnswer,
      caseInsensitiveMatch: true,
      isPremium: false,
    });
  }
}

async function seedExams(exams: ExamSeed[]) {
  for (const exam of exams) {
    const questions = await getExamQuestions(exam);

    if (questions.length < exam.questionCount) {
      throw new Error(
        `${exam.title} needs ${exam.questionCount} questions but only ${questions.length} are available.`,
      );
    }

    const test = await Test.create({
      title: exam.title,
      difficulty: exam.difficulty,
      isTimed: true,
      durationSeconds: exam.durationSeconds,
      isPremium: false,
    });

    for (const [index, question] of questions.slice(0, exam.questionCount).entries()) {
      await TestQuestion.create({
        testId: test.id,
        questionId: question.id,
        displayOrder: index,
        points: 1,
      });
    }

    console.log(`Seeded exam ${test.title}: ${exam.questionCount} questions, ${exam.durationSeconds / 60} minutes`);
  }
}

async function getExamQuestions(exam: ExamSeed) {
  const where: Record<string, any> = {};

  if (exam.topicSlugs?.length) {
    const topics = await Topic.find({ slug: { $in: exam.topicSlugs } }).select("_id");
    where.topicId = { $in: topics.map((topic: any) => topic.id) };
  }
  if (exam.questionType) where.type = exam.questionType;
  if (exam.questionDifficulty) where.difficulty = exam.questionDifficulty;

  const questions = await Question.find(where).sort({ createdAt: 1 }).select("_id difficulty");
  return questions.sort((first: any, second: any) => {
    return difficultyWeight(second.difficulty) - difficultyWeight(first.difficulty);
  });
}

function difficultyWeight(difficulty: Difficulty) {
  if (difficulty === "HARD") return 3;
  if (difficulty === "MEDIUM") return 2;
  return 1;
}

async function seed() {
  await connectDb();
  await resetContentData();

  for (const topicSeed of topics) {
    const topic = await Topic.create({
      title: topicSeed.title,
      slug: topicSeed.slug,
      description: topicSeed.description,
      isPremium: false,
    });

    await seedQuestions(topic.id, topicSeed.mcqs, topicSeed.shorts);

    const extraQuestions = extraQuestionsByTopic[topic.slug];
    if (extraQuestions) {
      await seedQuestions(topic.id, extraQuestions.mcqs, extraQuestions.shorts);
    }

    const totalQuestions =
      topicSeed.mcqs.length +
      topicSeed.shorts.length +
      (extraQuestions?.mcqs.length ?? 0) +
      (extraQuestions?.shorts.length ?? 0);

    console.log(`Seeded ${topic.title}: ${totalQuestions} questions`);
  }

  await seedExams(exams);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
