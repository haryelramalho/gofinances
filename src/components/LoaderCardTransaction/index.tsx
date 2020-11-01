import React from 'react';
import ContentLoader from 'react-content-loader';
import { shade } from 'polished';

import { Container } from './styles';

interface ILoaderCardTransaction {
  color: string;
  shadeValue: number;
}

const LoaderCardTransaction: React.FC<ILoaderCardTransaction> = ({ color, shadeValue }) => {
  return (
    <Container>
      <ContentLoader 
        speed={1}
        width={1080}
        height={62}
        viewBox="0 0 1080 62"
        backgroundColor={shade(shadeValue, color)}
          foregroundColor={color}
      >
        <rect x="0" y="0" rx="8" ry="8" width="100%" height="62px" />
      </ContentLoader>
    </Container>
  );
}

export default LoaderCardTransaction;