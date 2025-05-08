// Utility functions for handling ticket-related formatting and logic

/**
 * Returns the appropriate variant for a given priority level
 */
export const getPriorityVariant = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high':
    case 'urgent':
      return 'destructive';
    case 'medium':
      return 'warning';
    case 'low':
      return 'success';
    default:
      return 'secondary';
  }
};

/**
 * Returns the appropriate variant for a given status
 */
export const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'in_progress_by_ai':
      return 'destructive'; // Red - actively processing
    case 'needs_manual_review':
      return 'warning'; // Amber - requires human attention
    case 'resolved':
      return 'success'; // Green - completed
    default:
      return 'secondary';
  }
};

/**
 * Format a status string for display
 */
export const formatStatus = (status: string) => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
};

/**
 * Format a priority string for display
 */
export const formatPriority = (priority: string) => {
  return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
}; 