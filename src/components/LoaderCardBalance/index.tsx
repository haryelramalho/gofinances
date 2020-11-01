import React from 'react';
import ContentLoader from 'react-content-loader';
import { shade } from 'polished';

// import { Container } from './styles';

interface ILoaderCardBalance {
  color: string;
  shadeValue: number;
}

const LoaderCardBalance: React.FC<ILoaderCardBalance> = ({ color, shadeValue }) => {
  return (
    <ContentLoader 
      speed={1}
      width={235}
      height={61}
      viewBox="0 0 235 61"
      backgroundColor={color}
      foregroundColor={shade(shadeValue, color)}
    >
      <rect x="0" y="20" rx="8" ry="8" width="235" height="42" />
  </ContentLoader>
  );
}

export default LoaderCardBalance;