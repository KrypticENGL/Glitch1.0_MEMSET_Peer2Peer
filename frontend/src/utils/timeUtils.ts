import type { TimeUnit } from '../types/flashcard';

export const convertToMilliseconds = (interval: number, unit: TimeUnit): number => {
  const conversions: Record<TimeUnit, number> = {
    seconds: 1000,
    minutes: 1000 * 60,
    hours: 1000 * 60 * 60,
    days: 1000 * 60 * 60 * 24,
    weeks: 1000 * 60 * 60 * 24 * 7,
    months: 1000 * 60 * 60 * 24 * 30, // Approximate month as 30 days
  };
  
  return interval * conversions[unit];
};

export const formatTimeInterval = (interval: number, unit: TimeUnit): string => {
  if (interval === 1) {
    return `1 ${unit.slice(0, -1)}`; // Remove 's' for singular
  }
  return `${interval} ${unit}`;
};

export const getNextRevisionDate = (interval: number, unit: TimeUnit): Date => {
  const now = new Date();
  const milliseconds = convertToMilliseconds(interval, unit);
  return new Date(now.getTime() + milliseconds);
};

export const getTimeUntilRevision = (nextRevision: Date): { value: number; unit: string } => {
  const now = new Date();
  const diffMs = nextRevision.getTime() - now.getTime();
  
  if (diffMs <= 0) {
    return { value: 0, unit: 'overdue' };
  }
  
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  
  if (months > 0) {
    return { value: months, unit: months === 1 ? 'month' : 'months' };
  } else if (weeks > 0) {
    return { value: weeks, unit: weeks === 1 ? 'week' : 'weeks' };
  } else if (days > 0) {
    return { value: days, unit: days === 1 ? 'day' : 'days' };
  } else if (hours > 0) {
    return { value: hours, unit: hours === 1 ? 'hour' : 'hours' };
  } else if (minutes > 0) {
    return { value: minutes, unit: minutes === 1 ? 'minute' : 'minutes' };
  } else {
    return { value: seconds, unit: seconds === 1 ? 'second' : 'seconds' };
  }
};
