import { useState, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { Label } from '@/components/atoms/Label';
import { LocationAutocomplete } from '@/components/molecules/LocationAutocomplete';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { DEFAULT_MAP_CENTER, MAP_CONTAINER_STYLE } from '@/constants/maps';
import type { LocationPickerProps } from '@/types/componentTypes';

export function LocationPicker({
    value,
    onChange,
    label = 'Location',
    placeholder = 'Enter a location',
    disabled = false,
}: LocationPickerProps) {
    const { isLoaded } = useGoogleMaps();
    const [mapCenter, setMapCenter] = useState(DEFAULT_MAP_CENTER);
    const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);

    useEffect(() => {
        if (value && isLoaded && !markerPosition) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address: value }, (results, status) => {
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
    }, [value, isLoaded, markerPosition]);

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
        <div className="space-y-4">
            <LocationAutocomplete
                value={value}
                onChange={onChange}
                onPlaceSelect={handlePlaceSelect}
                label={label}
                placeholder={placeholder}
                disabled={disabled}
            />

            {isLoaded && (
                <div className="space-y-2">
                    <Label>Map Preview</Label>
                    <div className="rounded-lg overflow-hidden border">
                        <GoogleMap
                            mapContainerStyle={MAP_CONTAINER_STYLE}
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
                    {!markerPosition && (
                        <p className="text-xs text-muted-foreground">
                            Select a location to see it on the map
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
