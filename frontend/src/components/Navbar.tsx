import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Brightness4, Brightness7, Home, Settings } from '@mui/icons-material';

interface NavbarProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const Navbar = ({ isDarkMode, onThemeToggle }: NavbarProps) => {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar className="justify-between">
        <Typography variant="h6" component="div" className="font-bold">
          🌦️ Kosovo Weather
        </Typography>
        
        <Box className="flex items-center space-x-4">
          <IconButton
            component={RouterLink}
            to="/"
            color="inherit"
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Home />
          </IconButton>
          
          <IconButton
            component={RouterLink}
            to="/settings"
            color="inherit"
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Settings />
          </IconButton>
          
          <IconButton
            onClick={onThemeToggle}
            color="inherit"
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 