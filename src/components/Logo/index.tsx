import React from 'react';
import { ReactComponent as WebLogoBlack } from '../../assets/svg/WebLogo_Black.svg';
import { ReactComponent as WebLogoWhite } from '../../assets/svg/WebLogo_White.svg';
import { ReactComponent as WebLogoColor } from '../../assets/svg/WebLogo_Color.svg';

export type LogoVariant = 'BLACK' | 'WHITE' | 'COLOR';
type Props = { variant: LogoVariant };

export function Logo(props: Props) {
  switch (props.variant) {
    case 'COLOR':
      return <WebLogoColor />;
    case 'BLACK':
      return <WebLogoBlack />;
    case 'WHITE':
      return <WebLogoWhite />;
    default:
      throw new Error('Invalid logo variant.');
  }
}
