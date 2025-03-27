import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

interface CameraIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const CameraIcon: React.FC<CameraIconProps> = ({
  width = 30,
  height = 30,
  color = '#FFFFFF',
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 31 30" fill="none">
      <G clipPath="url(#clip0_24_218)">
        <Path
          d="M9.23633 3.79688L8.62695 5.625H4.25C2.18164 5.625 0.5 7.30664 0.5 9.375V24.375C0.5 26.4434 2.18164 28.125 4.25 28.125H26.75C28.8184 28.125 30.5 26.4434 30.5 24.375V9.375C30.5 7.30664 28.8184 5.625 26.75 5.625H22.373L21.7637 3.79688C21.3828 2.64844 20.3105 1.875 19.0977 1.875H11.9023C10.6895 1.875 9.61719 2.64844 9.23633 3.79688ZM15.5 11.25C16.9918 11.25 18.4226 11.8426 19.4775 12.8975C20.5324 13.9524 21.125 15.3832 21.125 16.875C21.125 18.3668 20.5324 19.7976 19.4775 20.8525C18.4226 21.9074 16.9918 22.5 15.5 22.5C14.0082 22.5 12.5774 21.9074 11.5225 20.8525C10.4676 19.7976 9.875 18.3668 9.875 16.875C9.875 15.3832 10.4676 13.9524 11.5225 12.8975C12.5774 11.8426 14.0082 11.25 15.5 11.25Z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_24_218">
          <Path d="M0.5 0H30.5V30H0.5V0Z" fill={color} />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
