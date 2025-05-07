-- Update existing ticket statuses to match new values
UPDATE "Ticket" SET status = 'IN_PROGRESS_BY_AI' WHERE status = 'IN_PROGRESS';
UPDATE "Ticket" SET status = 'UNDER_REVIEW' WHERE status = 'PENDING';
UPDATE "Ticket" SET status = 'PENDING_APPROVAL' WHERE status = 'OPEN';
UPDATE "Ticket" SET status = 'COMPLETED' WHERE status = 'RESOLVED';