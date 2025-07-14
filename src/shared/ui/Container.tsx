import { Container as MuiContainer, type ContainerProps as MuiContainerProps } from '@mui/material';

export type ContainerProps = MuiContainerProps;

export const Container = ({ children, maxWidth = 'xl', ...props }: ContainerProps) => {
  return (
    <MuiContainer maxWidth={maxWidth} {...props}>
      {children}
    </MuiContainer>
  );
};