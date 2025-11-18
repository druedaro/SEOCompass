import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleMap, Marker } from '@react-google-maps/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { LocationAutocomplete } from '@/components/molecules/LocationAutocomplete';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { createTeamSchema, CreateTeamFormData } from '@/schemas/teamSchema';
import { DEFAULT_MAP_CENTER, MAP_CONTAINER_STYLE } from '@/constants/maps';
import type { CreateTeamDialogProps } from '@/types/componentTypes';

export function CreateTeamDialog({ open, onOpenChange }: CreateTeamDialogProps) {
  const { createTeam } = useWorkspace();
  const { isLoaded } = useGoogleMaps();
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState('');
  
  const [mapCenter, setMapCenter] = useState(DEFAULT_MAP_CENTER);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);

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
      reset();
      setLocation('');
      setMapCenter(DEFAULT_MAP_CENTER);
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
            label="Location (Optional)"
            placeholder="San Francisco, CA"
            disabled={isLoading}
          />

          {isLoaded && markerPosition && (
            <div className="space-y-2">
              <Label>Map Preview</Label>
              <div className="rounded-lg overflow-hidden border">
                <GoogleMap
                  mapContainerStyle={MAP_CONTAINER_STYLE}
                  center={mapCenter}
                  zoom={12}
                  options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                  }}
                >
                  <Marker position={markerPosition} />
                </GoogleMap>
              </div>
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
