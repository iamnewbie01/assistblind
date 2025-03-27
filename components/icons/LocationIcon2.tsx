import React from 'react';
import {View} from 'react-native';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

export const LocationIcon: React.FC = () => {
  return (
    <View>
      <Svg width={15} height={21} viewBox="0 0 15 21" fill="none">
        <G clipPath="url(#clip0_29_189)">
          <Path
            d="M8.426 20a1.5 1.5 0 001.574-.5c2.004-2.508 6.574-8.586 6.574-12 0-4.14-3.36-7.5-7.5-7.5S1.574 3.36 1.574 7.5c0 3.414 4.57 9.492 6.574 12a1.5 1.5 0 001.278.5zM7.5 5.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5z"
            fill="#4F46E5"
          />
        </G>
        <Defs>
          <ClipPath id="clip0_29_189">
            <Path fill="#fff" d="M0 .5H15V20.5H0z" />
          </ClipPath>
        </Defs>
      </Svg>
    </View>
  );
};
