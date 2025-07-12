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
      { id: 1, name: 'Bánh mì trứng', calories: 350, image: '/food/banh-mi-trung.jpg', time: '07:30' },
      { id: 4, name: 'Sữa tươi', calories: 120, image: '/food/sua-tuoi.jpg', time: '08:00' }
    ],
    lunch: [
      { id: 2, name: 'Cơm gà xối mỡ', calories: 650, image: '/food/com-ga.jpg', time: '12:15' },
      { id: 5, name: 'Canh rau', calories: 80, image: '/food/canh-rau.jpg', time: '12:20' }
    ],
    dinner: [
      { id: 3, name: 'Bún chả', calories: 450, image: '/food/bun-cha.jpg', time: '18:45' }
    ],
    snack: []
  };

  const trendData = [
    { day: 'T2', calories: 1500, protein: 60, carbs: 180, fat: 40 },
    { day: 'T3', calories: 1700, protein: 65, carbs: 200, fat: 45 },
    { day: 'T4', calories: 1600, protein: 62, carbs: 190, fat: 42 },
    { day: 'T5', calories: 1750, protein: 68, carbs: 210, fat: 48 },
    { day: 'T6', calories: 1400, protein: 58, carbs: 170, fat: 38 },
    { day: 'T7', calories: 1850, protein: 70, carbs: 220, fat: 50 },
    { day: 'CN', calories: 1300, protein: 55, carbs: 160, fat: 35 }
  ];

  const tips = [
    {
      title: "💪 Bổ sung protein",
      content: "Bữa tối của bạn thiếu protein. Hãy thêm ức gà hoặc đậu phụ."
    },
    {
      title: "💧 Uống đủ nước",
      content: "Bạn mới uống được 800ml/2000ml nước hôm nay."
    },
    {
      title: "🥗 Ăn nhiều rau xanh",
      content: "Hôm nay bạn chưa ăn rau. Thêm rau vào bữa tối nhé!"
    }
  ];

  return (
    <div className="dashboard bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-4 md:p-8">
      {/* Main Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Chào buổi sáng, <span className="text-green-600">Nguyễn Văn A</span>!
        </h1>
        <p className="text-gray-500 mt-2">
          {new Date().toLocaleDateString('vi-VN', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}
        </p>
      </header>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Health Stats Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 transition-all hover:shadow-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-6 bg-green-500 rounded-full mr-3"></span>
              Tổng quan sức khỏe
            </h2>
            <HealthOverview {...healthData} />
          </div>

          {/* Nutrition Chart Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 transition-all hover:shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <span className="w-2 h-6 bg-blue-500 rounded-full mr-3"></span>
                Xu hướng dinh dưỡng
              </h2>
              <select className="text-sm border rounded-lg px-3 py-1 focus:outline-none">
                <option>7 ngày qua</option>
                <option>30 ngày qua</option>
              </select>
            </div>
            <div className="h-80">
              <NutritionTrends data={trendData} />
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-6">
          {/* Meal Tracking Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 transition-all hover:shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <span className="w-2 h-6 bg-orange-500 rounded-full mr-3"></span>
                Bữa ăn hôm nay
              </h2>
              <button className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors">
                + Thêm món
              </button>
            </div>
            <MealTracking meals={meals} />
          </div>

          {/* Health Tips Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 transition-all hover:shadow-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-6 bg-purple-500 rounded-full mr-3"></span>
              Gợi ý cho bạn
            </h2>
            <HealthTips tips={tips} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;