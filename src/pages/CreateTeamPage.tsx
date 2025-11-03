import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { LocationAutocomplete } from '@/components/molecules/LocationAutocomplete';
import { useWorkspace } from '@/context/WorkspaceContext';

const createTeamSchema = z.object({
  name: z.string().min(3, 'Team name must be at least 3 characters').max(50),
  description: z.string().max(200).optional(),
  location: z.string().max(100).optional(),
});

type CreateTeamFormData = z.infer<typeof createTeamSchema>;

export default function CreateTeamPage() {
  const navigate = useNavigate();
  const { createTeam } = useWorkspace();
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateTeamFormData>({
    resolver: zodResolver(createTeamSchema),
  });

  const onSubmit = async (data: CreateTeamFormData) => {
    setIsLoading(true);
    try {
      await createTeam({ ...data, location });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    setValue('location', value);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create New Team</CardTitle>
          <CardDescription>
            Set up a new team to collaborate on SEO projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            <LocationAutocomplete
              value={location}
              onChange={handleLocationChange}
              label="Location (Optional)"
              placeholder="San Francisco, CA"
              disabled={isLoading}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Creating...' : 'Create Team'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
