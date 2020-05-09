import React from 'react';
import { ReactComponent as WebLogo_Black } from '../../assets/svg/WebLogo_Black.svg';
import { ReactComponent as WebLogo_White } from '../../assets/svg/WebLogo_White.svg';
import { ReactComponent as WebLogo_Color } from '../../assets/svg/WebLogo_Color.svg';

export type LogoVariant = 'BLACK' | 'WHITE' | 'COLOR';
type Props = { variant: LogoVariant };

export function Logo(props: Props) {
  switch (props.variant) {
    case 'COLOR':
      return <WebLogo_Color />;
    case 'BLACK':
      return <WebLogo_Black />;
    case 'WHITE':
      return <WebLogo_White />;
    default:
      throw new Error('Invalid logo variant.');
  }
}
