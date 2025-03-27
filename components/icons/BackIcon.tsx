import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

export const BackIcon = () => {
  return (
    <Svg width={21} height={24} viewBox="0 0 21 24" fill="none">
      <G clipPath="url(#clip0_52_4)">
        <Path
          d="M.441 10.94a1.5 1.5 0 000 2.124l7.5 7.5a1.5 1.5 0 002.123-2.124L5.119 13.5H19.5a1.5 1.5 0 000-3H5.123l4.936-4.94a1.5 1.5 0 00-2.123-2.124L.436 10.935l.005.004z"
          fill="#1E293B"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_52_4">
          <Path fill="#fff" d="M0 0h21v24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
