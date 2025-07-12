// components/dashboards/MealTracking.jsx
import React from 'react';
import { FiPlus } from 'react-icons/fi';

const MealTracking = ({ meals, onAddFood }) => {
  const mealTimes = [
    { id: 'breakfast', name: 'Bữa sáng', icon: '☀️' },
    { id: 'lunch', name: 'Bữa trưa', icon: '🌞' },
    { id: 'dinner', name: 'Bữa tối', icon: '🌙' },
    { id: 'snack', name: 'Ăn nhẹ', icon: '🍎' }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Theo dõi bữa ăn</h2>
        <button className="text-sm text-green-600 flex items-center">
          <FiPlus className="mr-1" /> Thêm bữa ăn
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {mealTimes.map((meal) => (
          <div key={meal.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">{meal.icon} {meal.name}</h3>
              <button 
                onClick={() => onAddFood(meal.id)}
                className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
              >
                + Thêm món
              </button>
            </div>
            
            {meals[meal.id]?.length > 0 ? (
              <ul className="space-y-2">
                {meals[meal.id].map((food) => (
                  <li key={food.id} className="flex justify-between text-sm">
                    <span>{food.name}</span>
                    <span className="text-gray-500">{food.calories} kcal</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm">Chưa có món nào</p>
            )}

            <div className="mt-3 pt-3 border-t text-xs text-gray-500">
              Tổng: {meals[meal.id]?.reduce((sum, food) => sum + food.calories, 0) || 0} kcal
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealTracking;