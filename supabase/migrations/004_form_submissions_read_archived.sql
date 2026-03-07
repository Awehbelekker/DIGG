-- Form submissions: read and archive state
ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS "read" BOOLEAN DEFAULT false;
ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_form_submissions_read ON form_submissions("read");
CREATE INDEX IF NOT EXISTS idx_form_submissions_archived ON form_submissions(archived);
