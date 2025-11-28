import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Trash2, LogOut } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/molecules/Card';
import { LocationPicker } from '@/components/organisms/LocationPicker';
import { DeleteConfirmationDialog } from '@/components/molecules/DeleteConfirmationDialog';
import { DashboardLayout } from '@/components/organisms/DashboardLayout';
import { useTeam } from '@/hooks/useTeam';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { handleAsyncOperation } from '@/lib/asyncHandler';
import { updateTeamSchema } from '@/schemas/teamSchema';
import type { UpdateTeamFormData } from '@/types/schemas';

export function TeamSettingsPage() {
  const { currentTeam, updateTeam, deleteTeam, isOwner } = useTeam();
  const { leaveTeam } = useTeamMembers();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [location, setLocation] = useState(currentTeam?.location || '');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<UpdateTeamFormData>({
    resolver: zodResolver(updateTeamSchema),
    mode: 'onBlur',
    defaultValues: {
      name: currentTeam?.name || '',
      description: currentTeam?.description || '',
      location: currentTeam?.location || '',
    },
  });

  useEffect(() => {
    if (currentTeam) {
      reset({
        name: currentTeam.name,
        description: currentTeam.description || '',
        location: currentTeam.location || '',
      });
      setLocation(currentTeam.location || '');
    }
  }, [currentTeam, reset]);

  const onSubmit = async (data: UpdateTeamFormData) => {
    if (!currentTeam) return;

    await handleAsyncOperation(
      async () => {
        await updateTeam(currentTeam.id, { ...data, location });
      },
      {
        setLoading: setIsLoading,
        successMessage: 'Team updated successfully',
      }
    );
  };

  const handleDelete = async () => {
    if (!currentTeam) return;

    await handleAsyncOperation(
      async () => {
        await deleteTeam(currentTeam.id);
      },
      {
        setLoading: setIsLoading,
        successMessage: 'Team deleted successfully',
        onError: () => setShowDeleteDialog(false),
      }
    );
    setShowDeleteDialog(false);
  };

  const handleLeave = async () => {
    if (!currentTeam) return;

    await handleAsyncOperation(
      async () => {
        await leaveTeam();
      },
      {
        setLoading: setIsLoading,
        successMessage: 'You have left the team',
        onError: () => setShowLeaveDialog(false),
      }
    );
    setShowLeaveDialog(false);
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

                <LocationPicker
                  value={location}
                  onChange={handleLocationChange}
                  label="Location (Optional)"
                  disabled={isLoading}
                />

                <Button type="submit" disabled={isLoading} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {isOwner ? (
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
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Team
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Leave Team</CardTitle>
                <CardDescription>
                  Remove yourself from this team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={() => setShowLeaveDialog(true)}
                  disabled={isLoading}
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Leave Team
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <DeleteConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleDelete}
          title={`Delete "${currentTeam.name}" ? `}
          description="This will permanently delete the team and all its projects."
          isLoading={isLoading}
        />

        <DeleteConfirmationDialog
          open={showLeaveDialog}
          onOpenChange={setShowLeaveDialog}
          onConfirm={handleLeave}
          title={`Leave "${currentTeam.name}" ? `}
          description="You will no longer have access to this team's projects and data."
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
}
