"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";

export default function ScoreChart({ data = [] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Progression</CardTitle>
      </CardHeader>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="study"
              name="Study"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="quiz"
              name="Quiz"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="exam"
              name="Exam"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
