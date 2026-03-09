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
    if (score >= 80) return '#10B981';
    if (score >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative w-64 h-64 mx-auto">
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx="128"
          cy="128"
          r="90"
          stroke="rgba(14, 165, 233, 0.1)"
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
            transition: 'stroke-dashoffset 1.5s ease-out'
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-6xl font-bold glow-text">{animatedScore}</div>
        <div className="text-sm text-ice-white/60 mt-2">Security Score</div>
      </div>
    </div>
  );
}
