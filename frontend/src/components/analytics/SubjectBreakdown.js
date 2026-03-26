"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";

export default function SubjectBreakdown({ data = [] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance by Subject</CardTitle>
      </CardHeader>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis type="category" dataKey="subject" tick={{ fontSize: 12 }} stroke="#94a3b8" width={100} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            />
            <Bar dataKey="avgScore" name="Avg Score" fill="#6366f1" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
