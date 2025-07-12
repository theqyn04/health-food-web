// pages/Home.jsx
import React from 'react';
import HealthOverview from '../dashboards/HealthOverview';
import MealTracking from '../dashboards/MealTracking';
import NutritionTrends from '../dashboards/NutritionTrends';
import HealthTips from '../dashboards/HealthTips';


const HomePage = () => {
  // Mock data
  const healthData = {
    calories: { consumed: 1200, goal: 1800 },
    macros: {
      protein: { consumed: 50, goal: 70 },
      fat: { consumed: 30, goal: 50 },
      carbs: { consumed: 150, goal: 200 }
    },
    waterIntake: { consumed: 800, goal: 2000 }
  };

  const meals = {
    breakfast: [
      { id: 1, name: 'Bánh mì trứng', calories: 350 }
    ],
    lunch: [],
    dinner: [],
    snack: []
  };

  const trendData = [
    { day: 'T2', calories: 1500, protein: 60 },
    { day: 'T3', calories: 1700, protein: 65 },
    // ...
  ];

  const tips = [
    {
      title: "Bổ sung protein",
      content: "Bữa tối của bạn thiếu protein. Hãy thêm ức gà hoặc đậu phụ."
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <HealthOverview {...healthData} />
      <MealTracking meals={meals} onAddFood={(meal) => console.log(`Add to ${meal}`)} />
      <NutritionTrends data={trendData} />
      <HealthTips tips={tips} />
    </div>
  );
};

export default HomePage;