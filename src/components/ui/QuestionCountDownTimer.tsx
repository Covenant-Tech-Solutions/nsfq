/** @format */
import { secondToTime } from "@/utils/helper";
import { useEffect, useRef, useState } from "react";
interface CircleProgressBarProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  circleColor?: string;
  progressColor?: string;
  textColor?: string;
  showPercentage?: boolean;
  children?: React.ReactNode;
  direction?: "clockwise" | "counterclockwise";
}

interface CountdownTimerProps {
  initialDuration: number; // in seconds
  size?: number;
  strokeWidth?: number;
  circleColor?: string;
  progressColor?: string;
  textColor?: string;
  showRemainingTime?: boolean;
  onComplete?: () => void;
  autoStart?: boolean;
  questionOrder: number;
  setQuestionTimeOut: (updatedTime?: number) => void;
  getQuestionTimeOut: () => number;
  removeQuestionTimeOut: (order?: number) => void;
  isAlreadyAnswered?: boolean;
}

const CircleProgressBar = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  circleColor = "#e6e6e6",
  progressColor = "#3b82f6",
  textColor = "#374151",
  showPercentage = true,
  children,
  direction = "clockwise",
}: CircleProgressBarProps) => {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (clampedPercentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={`transform ${direction === "clockwise" ? "-rotate-90" : "rotate-90"}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={circleColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children ??
          (showPercentage && (
            <span style={{ color: textColor, fontSize: `${size / 4}px` }}>
              {Math.round(clampedPercentage)}%
            </span>
          ))}
      </div>
    </div>
  );
};

export const QuestionCountDownTimer = ({
  initialDuration,
  size = 160,
  strokeWidth = 6,
  circleColor = "#e6e6e6",
  progressColor = "#ef4444",
  textColor = "#374151",
  showRemainingTime = true,
  onComplete = () => {},
  autoStart = true,
  questionOrder,
  setQuestionTimeOut,
  getQuestionTimeOut,
  removeQuestionTimeOut,
  isAlreadyAnswered,
}: CountdownTimerProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(initialDuration);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const stored = getQuestionTimeOut();
    const startTime = stored || initialDuration;
    setTimeRemaining(startTime);
    setIsCompleted(false);

    if (!stored) {
      setQuestionTimeOut(startTime);
    }

    if (autoStart) {
      startTimer();
    }

    return stopTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionOrder, initialDuration, autoStart]);

  const startTimer = () => {
    stopTimer();
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const next = prev - 1;
        setQuestionTimeOut(next);

        if (next <= 0) {
          stopTimer();
          if (!isCompleted) {
            removeQuestionTimeOut(questionOrder);
            setIsCompleted(true);
            onComplete();
          }
          return 0;
        }

        return next;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const percentage = (timeRemaining / initialDuration) * 100;

  return (
    <div className="flex flex-col items-center">
      <CircleProgressBar
        percentage={isAlreadyAnswered ? 0 : percentage}
        size={size}
        strokeWidth={strokeWidth}
        circleColor={circleColor}
        progressColor={progressColor}
        textColor={textColor}
        showPercentage={false}
        direction="counterclockwise"
      >
        {showRemainingTime && (
          <span
            style={{
              color: textColor,
              fontSize: `${size / 5}px`,
              fontWeight: "bold",
            }}
          >
            {isAlreadyAnswered ? "00:00" : secondToTime(timeRemaining)}
          </span>
        )}
      </CircleProgressBar>
    </div>
  );
};
