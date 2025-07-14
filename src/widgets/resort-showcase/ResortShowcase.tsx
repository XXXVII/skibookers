import { Box, Typography, Chip, Stack } from '@mui/material';
import { Card } from '../../shared/ui';
import { getImageUrl } from '../../shared/utils/assets';
import type { Resort } from '../../shared/types';
import styles from './ResortShowcase.module.css';

export interface ResortShowcaseProps {
  resort: Resort;
}

export const ResortShowcase = ({ resort }: ResortShowcaseProps) => {
  return (
    <Card className={styles.card}>
      <Box
        className={styles.heroContainer}
        style={{
          backgroundImage: `url(${getImageUrl(resort.image)})`,
        }}
      >
        <Box className={styles.overlay} />
        <Box className={styles.contentBox}>
          <Typography variant="h4" component="h1" gutterBottom className={styles.title}>
            {resort.name}
          </Typography>
          <Typography variant="body1" className={styles.description}>
            {resort.description}
          </Typography>
          <Stack className={styles.chipContainer}>
            <Chip 
              label={resort.region} 
              size="small" 
              className={styles.chip}
            />
            <Chip 
              label={resort.difficulty} 
              size="small" 
              className={styles.chip}
            />
            <Chip 
              label={resort.vibe} 
              size="small" 
              className={styles.chip}
            />
          </Stack>
        </Box>
      </Box>
    </Card>
  );
};