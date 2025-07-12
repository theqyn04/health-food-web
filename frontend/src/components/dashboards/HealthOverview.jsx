// components/dashboards/HealthOverview.jsx
import React from 'react';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const HealthOverview = ({ calories, macros, waterIntake }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Tổng quan sức khỏe</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Calorie Progress */}
        <div className="flex flex-col items-center">
          <CircularProgressbarWithChildren
            value={(calories.consumed / calories.goal) * 100}
            styles={{
              path: { stroke: '#4CAF50' },
              text: { fontSize: '16px' }
            }}
          >
            <div className="text-center">
              <p className="text-3xl font-bold">{calories.consumed}</p>
              <p className="text-gray-500">/ {calories.goal} kcal</p>
            </div>
          </CircularProgressbarWithChildren>
          <p className="mt-2 text-sm">Lượng calo</p>
        </div>

        {/* Macros */}
        <div className="space-y-3">
          {Object.entries(macros).map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between text-sm">
                <span className="capitalize">{key}</span>
                <span>{value.consumed}g / {value.goal}g</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-blue-500" 
                  style={{ width: `${(value.consumed / value.goal) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Water Intake */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 bg-blue-100 rounded-full"></div>
            <div 
              className="absolute bottom-0 bg-blue-500 rounded-full w-full"
              style={{ height: `${(waterIntake.consumed / waterIntake.goal) * 100}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold">{waterIntake.consumed}/{waterIntake.goal} ml</span>
            </div>
          </div>
          <p className="mt-2 text-sm">Nước uống</p>
        </div>
      </div>
    </div>
  );
};

export default HealthOverview;