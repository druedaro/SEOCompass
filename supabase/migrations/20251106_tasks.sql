-- Create enum for task priority (if not exists)
DO $$ BEGIN
  CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create enum for task status (if not exists)
DO $$ BEGIN
  CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create tasks table (if not exists)
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority task_priority DEFAULT 'medium',
  status task_status DEFAULT 'todo',
  due_date TIMESTAMPTZ,
  
  -- Reference to project
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Textual reference for linking to audit issues
  -- Format: "URL: <url> | Issue: <issue_type>"
  audit_reference TEXT,
  
  -- Metadata
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Create indexes (if not exists)
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view tasks from their team projects" ON tasks;
DROP POLICY IF EXISTS "Users can create tasks in their team projects" ON tasks;
DROP POLICY IF EXISTS "Users can update tasks in their team projects" ON tasks;
DROP POLICY IF EXISTS "Users can delete tasks in their team projects" ON tasks;

-- RLS Policy: Users can only see tasks from projects in their teams
CREATE POLICY "Users can view tasks from their team projects"
  ON tasks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      INNER JOIN team_members tm ON p.team_id = tm.team_id
      WHERE p.id = tasks.project_id
      AND tm.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can create tasks in their team projects
CREATE POLICY "Users can create tasks in their team projects"
  ON tasks
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      INNER JOIN team_members tm ON p.team_id = tm.team_id
      WHERE p.id = tasks.project_id
      AND tm.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update tasks in their team projects
CREATE POLICY "Users can update tasks in their team projects"
  ON tasks
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      INNER JOIN team_members tm ON p.team_id = tm.team_id
      WHERE p.id = tasks.project_id
      AND tm.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can delete tasks in their team projects
CREATE POLICY "Users can delete tasks in their team projects"
  ON tasks
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      INNER JOIN team_members tm ON p.team_id = tm.team_id
      WHERE p.id = tasks.project_id
      AND tm.user_id = auth.uid()
    )
  );

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS tasks_updated_at ON tasks;
DROP FUNCTION IF EXISTS update_tasks_updated_at();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  
  -- Auto-set completed_at when status changes to completed
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = now();
  END IF;
  
  -- Clear completed_at when status changes from completed
  IF NEW.status != 'completed' AND OLD.status = 'completed' THEN
    NEW.completed_at = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_tasks_updated_at();
