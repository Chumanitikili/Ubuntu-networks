import { SvgIcon, SvgIconProps } from '@mui/material';
import './logo.css';

interface LogoProps extends SvgIconProps {
  variant?: 'default' | 'small';
  animated?: boolean;
}

export const Logo = ({ variant = 'default', animated = true, ...props }: LogoProps) => {
  const size = variant === 'small' ? 24 : 32;

  return (
    <SvgIcon
      {...props}
      sx={{
        width: size,
        height: size,
        ...props.sx
      }}
      viewBox="0 0 24 24"
    >
      {/* Outer circle */}
      <circle
        className={animated ? 'logo-circle logo-circle-outer' : ''}
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 2"
      />
      
      {/* Middle circle */}
      <circle
        className={animated ? 'logo-circle logo-circle-middle' : ''}
        cx="12"
        cy="12"
        r="7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 1.5"
      />
      
      {/* Inner circle */}
      <circle
        className={animated ? 'logo-circle logo-circle-inner' : ''}
        cx="12"
        cy="12"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 1"
      />
      
      {/* Core */}
      <circle
        className={animated ? 'logo-core' : ''}
        cx="12"
        cy="12"
        r="2"
        fill="currentColor"
      />
    </SvgIcon>
  );
};
