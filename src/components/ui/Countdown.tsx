/** @format */
"use client";

import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";

type Props = {
  dateTime: string;
};

const Countdown: React.FC<Props> = ({ dateTime }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  const updateCountdown = useCallback(() => {
    const now = moment();
    const target = moment(dateTime);
    const duration = moment.duration(target.diff(now));

    if (duration.asMilliseconds() <= 0) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return false;
    }

    setTimeLeft({
      days: Math.floor(duration.asDays()),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    });

    return true;
  }, [dateTime]);

  useEffect(() => {
    updateCountdown();
    const interval = setInterval(() => {
      const shouldContinue = updateCountdown();
      if (!shouldContinue) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [updateCountdown]);

  if (!timeLeft) return null;

  const { days, hours, minutes, seconds } = timeLeft;

  const formatTime = () => {
    if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  return <span>{formatTime()}</span>;
};

export default Countdown;
