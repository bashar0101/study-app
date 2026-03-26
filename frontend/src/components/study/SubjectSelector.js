"use client";

import { useEffect, useState } from "react";
import useStudyStore from "@/store/studyStore";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

export default function SubjectSelector({ onSelect, selectedSubjectId, selectedTopicId, onTopicSelect }) {
  const { subjects, isLoadingSubjects, fetchSubjects } = useStudyStore();
  const [expandedSubject, setExpandedSubject] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  if (isLoadingSubjects) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Select Subject</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {subjects.map((subject) => (
          <Card
            key={subject.id}
            padding={false}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              selectedSubjectId === subject.id && "ring-2 ring-indigo-500"
            )}
            onClick={() => {
              onSelect(subject.id);
              setExpandedSubject(subject.id === expandedSubject ? null : subject.id);
            }}
          >
            <div className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{subject.icon || "📚"}</span>
                <div>
                  <p className="font-medium text-gray-900">{subject.name}</p>
                  {subject.description && (
                    <p className="text-xs text-gray-500">{subject.description}</p>
                  )}
                </div>
              </div>

              {/* Topics dropdown */}
              {selectedSubjectId === subject.id && subject.topics?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                  <p className="text-xs font-medium text-gray-500 mb-2">Topics</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTopicSelect?.(null);
                    }}
                    className={cn(
                      "w-full text-left text-sm px-2 py-1.5 rounded",
                      !selectedTopicId ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    All Topics
                  </button>
                  {subject.topics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTopicSelect?.(topic.id);
                      }}
                      className={cn(
                        "w-full text-left text-sm px-2 py-1.5 rounded",
                        selectedTopicId === topic.id
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {topic.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
