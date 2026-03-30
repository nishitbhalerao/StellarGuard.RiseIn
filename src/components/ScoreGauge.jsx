import { useEffect, useState } from 'react';

export default function ScoreGauge({ score, riskLevel }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getColor = () => {
    if (score >= 80) return '#10B981'; // accent-green
    if (score >= 50) return '#F59E0B'; // warning-orange
    return '#EF4444'; // error-red
  };

  const getGradient = () => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 50) return 'from-orange-500 to-yellow-500';
    return 'from-red-500 to-red-600';
  };

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Background Circle */}
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx="128"
          cy="128"
          r="90"
          stroke="#E5E7EB"
          strokeWidth="12"
          fill="none"
        />
        <circle
          cx="128"
          cy="128"
          r="90"
          stroke={getColor()}
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1.5s ease-out',
            filter: 'drop-shadow(0 0 8px rgba(37, 99, 235, 0.3))'
          }}
        />
      </svg>
      
      {/* Score Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-6xl font-bold text-gradient mb-2">{animatedScore}</div>
        <div className="text-sm text-gray-600 font-medium">Security Score</div>
        <div className="text-xs text-gray-600 mt-1">out of 100</div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r ${getGradient()} rounded-full animate-pulse-soft`}></div>
        <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r ${getGradient()} rounded-full animate-pulse-soft`} style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  );
}
