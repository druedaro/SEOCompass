import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { LocationAutocomplete } from '@/components/molecules/LocationAutocomplete';
import { DashboardLayout } from '@/components/organisms/DashboardLayout';
import { useWorkspace } from '@/context/WorkspaceContext';

const updateTeamSchema = z.object({
  name: z.string().min(3, 'Team name must be at least 3 characters').max(50),
  description: z.string().max(200).optional(),
  location: z.string().max(100).optional(),
});

type UpdateTeamFormData = z.infer<typeof updateTeamSchema>;

export default function TeamSettingsPage() {
  const { currentTeam, updateTeam, deleteTeam } = useWorkspace();
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(currentTeam?.location || '');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UpdateTeamFormData>({
    resolver: zodResolver(updateTeamSchema),
    defaultValues: {
      name: currentTeam?.name || '',
      description: currentTeam?.description || '',
      location: currentTeam?.location || '',
    },
  });

  const onSubmit = async (data: UpdateTeamFormData) => {
    if (!currentTeam) return;

    setIsLoading(true);
    try {
      await updateTeam(currentTeam.id, { ...data, location });
    } catch (error) {
      console.error('Error updating team:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentTeam) return;

    if (!confirm(`Are you sure you want to delete "${currentTeam.name}"? This action cannot be undone.`)) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteTeam(currentTeam.id);
    } catch (error) {
      console.error('Error deleting team:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    setValue('location', value);
  };

  if (!currentTeam) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <p>No team selected</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Team Settings</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>
              Update your team's basic information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Team Name *</Label>
                <Input
                  id="name"
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
                  {...register('description')}
                  disabled={isLoading}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <LocationAutocomplete
                value={location}
                onChange={handleLocationChange}
                label="Location"
                disabled={isLoading}
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Team
            </Button>
          </CardContent>
        </Card>
      </div>
      </div>
    </DashboardLayout>
  );
}
