import { useState } from 'react';
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
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { LocationPicker } from '@/components/organisms/LocationPicker';
import { useWorkspace } from '@/hooks/useWorkspace';
import { createTeamSchema } from '@/schemas/teamSchema';
import type { CreateTeamFormData } from '@/types/schemas';
import { showSuccessToast } from '@/lib/toast';
import type { CreateTeamDialogProps } from '@/types/componentTypes';

export function CreateTeamDialog({ open, onOpenChange }: CreateTeamDialogProps) {
  const { createTeam } = useWorkspace();
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTeamFormData>({
    resolver: zodResolver(createTeamSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: CreateTeamFormData) => {
    setIsLoading(true);
    try {
      await createTeam({ ...data, location });
      showSuccessToast('Team created successfully!');
      reset();
      setLocation('');
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Create a new team to collaborate with others on SEO projects.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name *</Label>
            <Input
              id="name"
              placeholder="My SEO Team"
              {...register('name')}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Brief description of your team"
              {...register('description')}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <LocationPicker
            value={location}
            onChange={setLocation}
            label="Location (Optional)"
            placeholder="San Francisco, CA"
            disabled={isLoading}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Team'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
