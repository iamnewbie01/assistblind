export interface LocationDetails {
  id: string;
  name: string;
  address: string;
  distance: string;
  time?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface ButtonProps {
  onPress: () => void;
  label: string;
  variant?: 'primary' | 'secondary';
}

export type RouteParams = {
  locationDetails: LocationDetails;
};

export type StackParamList = {
  OutdoorNavigationScreen2: undefined;
  OutdoorNavigationScreen3: {locationDetails: LocationDetails};
};

export interface Place {
  id: string;
  name: string;
  formatted_address: string;
  distance: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}
