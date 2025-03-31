import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-background"
    >
      <Box className="text-center">
        <CircularProgress
          size={60}
          thickness={4}
          className="text-primary mb-4"
        />
        <Typography
          variant="h6"
          className="text-gray-600 dark:text-gray-300 animate-pulse"
        >
          Loading weather data...
        </Typography>
      </Box>
    </motion.div>
  );
};

export default LoadingScreen; 