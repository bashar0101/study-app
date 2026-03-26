"use client";

import { useState, useEffect } from "react";
import SubjectSelector from "@/components/study/SubjectSelector";
import DifficultySelector from "@/components/study/DifficultySelector";
import Button from "@/components/ui/Button";
import useStudyStore from "@/store/studyStore";
import { cn } from "@/lib/utils";

const TIME_OPTIONS = [15, 30, 45, 60, 90, 120];
const COUNT_OPTIONS = [10, 20, 30, 40, 50];

export default function ExamConfig({ onStart, isStarting }) {
  const { subjects } = useStudyStore();
  const [subjectId, setSubjectId] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [questionCount, setQuestionCount] = useState(20);
  const [timeLimitMin, setTimeLimitMin] = useState(60);

  const selectedSubject = subjects.find((s) => s.id === subjectId);

  const toggleTopic = (topicId) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  const handleStart = () => {
    if (!subjectId || selectedTopics.length === 0) return;
    onStart({ subjectId, topicIds: selectedTopics, difficulty, questionCount, timeLimitMin });
  };

  return (
    <div className="space-y-6">
      <SubjectSelector
        onSelect={(id) => {
          setSubjectId(id);
          setSelectedTopics([]);
        }}
        selectedSubjectId={subjectId}
      />

      {/* Topic multi-select */}
      {selectedSubject?.topics?.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">
            Select Topics ({selectedTopics.length} selected)
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedSubject.topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => toggleTopic(topic.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm border transition-all",
                  selectedTopics.includes(topic.id)
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                )}
              >
                {topic.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <DifficultySelector value={difficulty} onChange={setDifficulty} />

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Number of Questions</h3>
        <div className="flex flex-wrap gap-2">
          {COUNT_OPTIONS.map((count) => (
            <button
              key={count}
              onClick={() => setQuestionCount(count)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium border transition-all",
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

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Time Limit (minutes)</h3>
        <div className="flex flex-wrap gap-2">
          {TIME_OPTIONS.map((mins) => (
            <button
              key={mins}
              onClick={() => setTimeLimitMin(mins)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium border transition-all",
                timeLimitMin === mins
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              )}
            >
              {mins}m
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleStart}
        loading={isStarting}
        disabled={!subjectId || selectedTopics.length === 0}
        size="lg"
        className="w-full"
      >
        Start Exam
      </Button>
    </div>
  );
}
