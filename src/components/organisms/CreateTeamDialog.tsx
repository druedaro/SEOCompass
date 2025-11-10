import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GoogleMap, Marker } from '@react-google-maps/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/organisms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { LocationAutocomplete } from '@/components/molecules/LocationAutocomplete';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';

const createTeamSchema = z.object({
  name: z.string().min(3, 'Team name must be at least 3 characters').max(50),
  description: z.string().max(200).optional(),
});

type CreateTeamFormData = z.infer<typeof createTeamSchema>;

interface CreateTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTeamDialog({ open, onOpenChange }: CreateTeamDialogProps) {
  const { createTeam } = useWorkspace();
  const { isLoaded } = useGoogleMaps();
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState('');
  
  const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // San Francisco
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTeamFormData>({
    resolver: zodResolver(createTeamSchema),
  });

  const onSubmit = async (data: CreateTeamFormData) => {
    setIsLoading(true);
    try {
      await createTeam({ ...data, location });
      reset();
      setLocation('');
      setMapCenter(defaultCenter);
      setMarkerPosition(null);
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const newCenter = { lat, lng };
      
      setMapCenter(newCenter);
      setMarkerPosition(newCenter);
    }
  };

  const mapContainerStyle = {
    width: '100%',
    height: '300px',
    borderRadius: '0.5rem',
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

          <LocationAutocomplete
            value={location}
            onChange={setLocation}
            onPlaceSelect={handlePlaceSelect}
            label="Location"
            placeholder="San Francisco, CA"
            disabled={isLoading}
          />

          {isLoaded && (
            <div className="space-y-2">
              <Label>Map Preview</Label>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={markerPosition ? 12 : 10}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                }}
              >
                {markerPosition && <Marker position={markerPosition} />}
              </GoogleMap>
            </div>
          )}

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
