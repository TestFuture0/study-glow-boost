
/**
 * Format a date string into a human-readable format
 * @param dateString Date string to format
 * @returns Formatted date string (e.g. "Today, 12:30 PM", "Yesterday, 4:45 PM", or "Apr 18, 2023")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();
  
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
  
  if (isToday) {
    return `Today, ${timeString}`;
  } else if (isYesterday) {
    return `Yesterday, ${timeString}`;
  } else {
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }
};
