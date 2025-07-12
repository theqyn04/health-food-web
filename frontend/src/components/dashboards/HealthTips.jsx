// components/dashboards/HealthTips.jsx
import React from 'react';

const HealthTips = ({ tips }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
      <h2 className="text-xl font-bold mb-4">Gợi ý cho bạn</h2>
      <div className="space-y-4">
        {tips.map((tip, index) => (
          <div key={index} className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800">{tip.title}</h3>
            <p className="text-sm mt-1 text-gray-600">{tip.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthTips;