// Format utilities for the application

import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

/**
 * Format a date based on its recency
 * - For today's dates, shows time (e.g. "2:30 PM")
 * - For yesterday, shows "Yesterday"
 * - For other dates this year, shows month and day (e.g. "Jun 15")
 * - For older dates, shows month, day and year (e.g. "Jun 15, 2022")
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, 'h:mm a')}`;
  }
  
  if (isYesterday(dateObj)) {
    return `Yesterday at ${format(dateObj, 'h:mm a')}`;
  }
  
  // If date is this year but not today or yesterday
  if (dateObj.getFullYear() === new Date().getFullYear()) {
    return format(dateObj, 'MMM d');
  }
  
  // For older dates
  return format(dateObj, 'MMM d, yyyy');
};

/**
 * Format a date as relative time (e.g. "5 minutes ago", "2 days ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

/**
 * Format a date in standard format (e.g. "June 15, 2023")
 */
export const formatFullDate = (date: string | Date): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMMM d, yyyy');
};

/**
 * Format a datetime (e.g. "June 15, 2023 at 2:30 PM")
 */
export const formatDateTime = (date: string | Date): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMMM d, yyyy \'at\' h:mm a');
}; 