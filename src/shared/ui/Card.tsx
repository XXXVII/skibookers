import { Card as MuiCard, type CardProps as MuiCardProps } from '@mui/material';

export type CardProps = MuiCardProps;

export const Card = ({ children, sx, ...props }: CardProps) => {
  return (
    <MuiCard 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        ...sx 
      }} 
      {...props}
    >
      {children}
    </MuiCard>
  );
};