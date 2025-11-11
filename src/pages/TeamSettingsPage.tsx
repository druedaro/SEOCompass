import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Trash2 } from 'lucide-react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { LocationAutocomplete } from '@/components/molecules/LocationAutocomplete';
import { DeleteConfirmationDialog } from '@/components/molecules/DeleteConfirmationDialog';
import { DashboardLayout } from '@/components/organisms/DashboardLayout';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { updateTeamSchema, UpdateTeamFormData } from '@/schemas/teamSchema';

const mapContainerStyle = {
  width: '100%',
  height: '300px',
};

const defaultCenter = {
  lat: 37.7749, // San Francisco
  lng: -122.4194,
};

export default function TeamSettingsPage() {
  const { currentTeam, updateTeam, deleteTeam } = useWorkspace();
  const { isLoaded } = useGoogleMaps();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [location, setLocation] = useState(currentTeam?.location || '');
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentTeam) return;

    setIsLoading(true);
    try {
      await deleteTeam(currentTeam.id);
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    setValue('location', value);
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

  useEffect(() => {
    if (currentTeam?.location && isLoaded) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: currentTeam.location }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          const coords = {
            lat: location.lat(),
            lng: location.lng(),
          };
          setMapCenter(coords);
          setMarkerPosition(coords);
        }
      });
    }
  }, [currentTeam?.location, isLoaded]);

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
                onPlaceSelect={handlePlaceSelect}
                label="Location"
                disabled={isLoading}
              />

              {isLoaded && (
                <div className="space-y-2">
                  <Label>Map Preview</Label>
                  <div className="rounded-lg overflow-hidden border">
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={mapCenter}
                      zoom={markerPosition ? 13 : 10}
                      options={{
                        disableDefaultUI: false,
                        zoomControl: true,
                        mapTypeControl: false,
                        streetViewControl: false,
                        fullscreenControl: false,
                      }}
                    >
                      {markerPosition && <Marker position={markerPosition} />}
                    </GoogleMap>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Select a location to see it on the map
                  </p>
                </div>
              )}

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
              onClick={() => setShowDeleteDialog(true)}
              disabled={isLoading}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Team
            </Button>
          </CardContent>
        </Card>
      </div>

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title={`Delete "${currentTeam.name}"?`}
        description="This will permanently delete the team and all its projects."
        isLoading={isLoading}
      />
      </div>
    </DashboardLayout>
  );
}
