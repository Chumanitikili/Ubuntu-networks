import { Box, Typography, useTheme } from '@mui/material';
import { Logo } from './logo';

interface LogoWithTextProps {
  variant?: 'default' | 'small';
}

export const LogoWithText = ({ variant = 'default' }: LogoWithTextProps) => {
  const theme = useTheme();
  const size = variant === 'small' ? 24 : 32;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Logo
        variant={variant}
        sx={{
          color: theme.palette.primary.main
        }}
      />
      <Typography
        variant={variant === 'small' ? 'subtitle1' : 'h6'}
        sx={{
          fontWeight: 600,
          color: theme.palette.primary.main,
          letterSpacing: '-0.5px'
        }}
      >
        Ubuntu Networks
      </Typography>
    </Box>
  );
};
