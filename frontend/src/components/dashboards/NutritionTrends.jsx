// components/dashboards/NutritionTrends.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const NutritionTrends = ({ data }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
      <h2 className="text-xl font-bold mb-4">Xu hướng dinh dưỡng (7 ngày)</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="calories" fill="#4CAF50" name="Calories" />
            <Bar dataKey="protein" fill="#2196F3" name="Protein (g)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NutritionTrends;