"use client";

import { useState } from "react";
import SubjectSelector from "@/components/study/SubjectSelector";
import DifficultySelector from "@/components/study/DifficultySelector";
import Button from "@/components/ui/Button";
import { QUESTION_COUNT_OPTIONS } from "@/constants/subjects";
import { cn } from "@/lib/utils";

export default function QuizConfig({ onStart, isStarting }) {
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState(null);
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [questionCount, setQuestionCount] = useState(10);

  const handleStart = () => {
    if (!subjectId) return;
    onStart({ subjectId, topicId, difficulty, questionCount });
  };

  return (
    <div className="space-y-6">
      <SubjectSelector
        onSelect={setSubjectId}
        selectedSubjectId={subjectId}
        selectedTopicId={topicId}
        onTopicSelect={setTopicId}
      />

      <DifficultySelector value={difficulty} onChange={setDifficulty} />

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Number of Questions</h3>
        <div className="flex gap-3">
          {QUESTION_COUNT_OPTIONS.map((count) => (
            <button
              key={count}
              onClick={() => setQuestionCount(count)}
              className={cn(
                "flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all",
                questionCount === count
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              )}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleStart}
        loading={isStarting}
        disabled={!subjectId}
        size="lg"
        className="w-full"
      >
        Start Quiz
      </Button>
    </div>
  );
}
