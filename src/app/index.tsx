import { ThemeProvider } from './providers';
import { SkiTripPage } from '../pages/ski-trip';

export const App = () => {
  return (
    <ThemeProvider>
      <SkiTripPage />
    </ThemeProvider>
  );
};