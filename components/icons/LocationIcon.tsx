import React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

interface LocationIconProps {
  size?: number;
  color?: string;
}

export const LocationIcon: React.FC<LocationIconProps> = ({
  size = 15,
  color = '#4F46E5',
}) => {
  return (
    <Svg width={size} height={(size * 20) / 15} viewBox="0 0 15 20" fill="none">
      <G clipPath="url(#clip0_24_238)">
        <Path
          d="M8.42578 19.5C10.4297 16.9922 15 10.9141 15 7.5C15 3.35938 11.6406 0 7.5 0C3.35938 0 0 3.35938 0 7.5C0 10.9141 4.57031 16.9922 6.57422 19.5C7.05469 20.0977 7.94531 20.0977 8.42578 19.5ZM7.5 5C8.16304 5 8.79893 5.26339 9.26777 5.73223C9.73661 6.20107 10 6.83696 10 7.5C10 8.16304 9.73661 8.79893 9.26777 9.26777C8.79893 9.73661 8.16304 10 7.5 10C6.83696 10 6.20107 9.73661 5.73223 9.26777C5.26339 8.79893 5 8.16304 5 7.5C5 6.83696 5.26339 6.20107 5.73223 5.73223C6.20107 5.26339 6.83696 5 7.5 5Z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_24_238">
          <Path d="M0 0H15V20H0V0Z" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
