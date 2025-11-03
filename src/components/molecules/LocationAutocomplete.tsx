import { useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function LocationAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  label = 'Location',
  placeholder = 'Enter a location',
  disabled = false,
}: LocationAutocompleteProps) {
  const { isLoaded } = useGoogleMaps();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.formatted_address) {
        onChange(place.formatted_address);
        onPlaceSelect?.(place);
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="space-y-2">
        {label && <Label>{label}</Label>}
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Loading..." disabled />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
        />
      </Autocomplete>
    </div>
  );
}
