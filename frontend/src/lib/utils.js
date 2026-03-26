import { clsx } from "clsx";

export function cn(...inputs) {
  return clsx(inputs);
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

export function formatTimeRemaining(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const pad = (n) => String(n).padStart(2, "0");
  if (hrs > 0) return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  return `${pad(mins)}:${pad(secs)}`;
}

export function getScoreColor(score) {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
}

export function getScoreBg(score) {
  if (score >= 80) return "bg-green-100";
  if (score >= 60) return "bg-yellow-100";
  return "bg-red-100";
}

export function getDifficultyColor(difficulty) {
  const colors = {
    EASY: "text-green-600",
    MEDIUM: "text-yellow-600",
    HARD: "text-red-600",
  };
  return colors[difficulty] || "text-gray-600";
}

export function truncate(str, length = 50) {
  if (!str) return "";
  return str.length > length ? str.slice(0, length) + "..." : str;
}

export function debounce(fn, delay = 300) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
