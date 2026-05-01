export type TopicProgress = {
  solvedQuestionIds: string[];
  timeSpentSeconds: number;
};

export type TopicProgressMap = Record<string, TopicProgress>;

const STORAGE_KEY = "prepwise_topic_progress";
export const TOPIC_PROGRESS_EVENT = "prepwise-topic-progress-updated";

function emptyProgress(): TopicProgress {
  return {
    solvedQuestionIds: [],
    timeSpentSeconds: 0,
  };
}

export function readTopicProgress(): TopicProgressMap {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as TopicProgressMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function getTopicProgress(topicId: string, progress = readTopicProgress()) {
  return progress[topicId] ?? emptyProgress();
}

export function writeTopicProgress(progress: TopicProgressMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  window.dispatchEvent(new Event(TOPIC_PROGRESS_EVENT));
}

export function markTopicQuestionSolved(topicId: string, questionId: string) {
  const progress = readTopicProgress();
  const current = getTopicProgress(topicId, progress);
  if (current.solvedQuestionIds.includes(questionId)) return;

  writeTopicProgress({
    ...progress,
    [topicId]: {
      ...current,
      solvedQuestionIds: [...current.solvedQuestionIds, questionId],
    },
  });
}

export function addTopicTime(topicId: string, seconds: number) {
  if (seconds <= 0) return;
  const progress = readTopicProgress();
  const current = getTopicProgress(topicId, progress);

  writeTopicProgress({
    ...progress,
    [topicId]: {
      ...current,
      timeSpentSeconds: current.timeSpentSeconds + seconds,
    },
  });
}

export function formatTopicTime(seconds: number) {
  if (seconds < 60) return "0m";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

export function topicMasteryPercent(solvedCount: number, questionCount: number) {
  if (!questionCount) return 0;
  return Math.min(100, Math.round((solvedCount / questionCount) * 100));
}
