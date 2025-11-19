import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/molecules/Dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/molecules/Form';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Button } from '@/components/atoms/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/molecules/Select';
import { DatePicker } from '@/components/molecules/DatePicker';
import { createTask, updateTask, type CreateTaskInput } from '@/services/task/taskService';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '@/constants/tasks';
import { taskSchema } from '@/schemas/taskSchema';
import type { TaskFormData } from '@/types/schemas';
import type { CreateTaskModalProps } from '@/types/componentTypes';

export function CreateTaskModal({
  open,
  onOpenChange,
  projectId,
  onTaskCreated,
  auditReference,
  initialTitle,
  initialDescription,
  taskToEdit,
}: CreateTaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const { teamMembers } = useWorkspace();

  const isEditing = !!taskToEdit;

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    mode: 'onBlur',
    defaultValues: {
      title: initialTitle || '',
      description: initialDescription || '',
      priority: 'medium',
      status: 'todo',
      audit_reference: auditReference || '',
      assigned_to: 'unassigned',
    },
  });

  useEffect(() => {
    if (open) {
      if (taskToEdit) {
        form.reset({
          title: taskToEdit.title,
          description: taskToEdit.description || '',
          priority: taskToEdit.priority,
          status: taskToEdit.status,
          audit_reference: taskToEdit.audit_reference || '',
          assigned_to: taskToEdit.assigned_to || 'unassigned',
        });
        if (taskToEdit.due_date) {
          setSelectedDate(new Date(taskToEdit.due_date));
        }
      } else {
        form.reset({
          title: initialTitle || '',
          description: initialDescription || '',
          priority: 'medium',
          status: 'todo',
          audit_reference: auditReference || '',
          assigned_to: 'unassigned',
        });
        setSelectedDate(undefined);
      }
    }
  }, [open, taskToEdit, auditReference, initialTitle, initialDescription, form]);

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      const assignedToValue = data.assigned_to === 'unassigned' ? undefined : data.assigned_to;

      const input: CreateTaskInput = {
        ...data,
        project_id: projectId,
        due_date: selectedDate?.toISOString(),
        assigned_to: assignedToValue,
      };

      if (isEditing && taskToEdit) {
        await updateTask(taskToEdit.id, input);
      } else {
        await createTask(input);
      }

      onTaskCreated();
      onOpenChange(false);
      form.reset({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        audit_reference: '',
        assigned_to: 'unassigned',
      });
      setSelectedDate(undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the task details below.'
              : 'Add a new task to track your SEO improvements and fixes.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Fix meta description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add more details about this task..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRIORITY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="assigned_to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign to</FormLabel>
                  <Select value={field.value || 'unassigned'} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.user_id} value={member.user_id}>
                          {member.profile?.full_name || member.profile?.email || 'Unknown'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <DatePicker
                date={selectedDate}
                onDateChange={setSelectedDate}
                placeholder="Select due date"
              />
            </FormItem>

            {auditReference && (
              <FormField
                control={form.control}
                name="audit_reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audit Reference</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="URL | Issue"
                        {...field}
                        className="bg-muted"
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && isEditing && 'Updating...'}
                {isSubmitting && !isEditing && 'Creating...'}
                {!isSubmitting && isEditing && 'Update Task'}
                {!isSubmitting && !isEditing && 'Create Task'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
