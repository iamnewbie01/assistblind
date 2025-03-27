import React from 'react';
import Svg, {Path, G, Defs, ClipPath} from 'react-native-svg';

export const ProfileIcon: React.FC = () => {
  return (
    <Svg width={14} height={16} viewBox="0 0 14 16" fill="none">
      <G clipPath="url(#clip0_24_211)">
        <Path
          d="M7 8C8.06087 8 9.07828 7.57857 9.82843 6.82843C10.5786 6.07828 11 5.06087 11 4C11 2.93913 10.5786 1.92172 9.82843 1.17157C9.07828 0.421427 8.06087 0 7 0C5.93913 0 4.92172 0.421427 4.17157 1.17157C3.42143 1.92172 3 2.93913 3 4C3 5.06087 3.42143 6.07828 4.17157 6.82843C4.92172 7.57857 5.93913 8 7 8ZM5.57188 9.5C2.49375 9.5 0 11.9937 0 15.0719C0 15.5844 0.415625 16 0.928125 16H13.0719C13.5844 16 14 15.5844 14 15.0719C14 11.9937 11.5063 9.5 8.42813 9.5H5.57188Z"
          fill="#475569"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_24_211">
          <Path d="M0 0H14V16H0V0Z" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
