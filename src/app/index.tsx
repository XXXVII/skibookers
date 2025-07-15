import { ThemeProvider } from './providers';
import { SkiTripPage } from '../pages/ski-trip';
import { ErrorBoundary } from '../shared/components';

export const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SkiTripPage />
      </ThemeProvider>
    </ErrorBoundary>
  );
};