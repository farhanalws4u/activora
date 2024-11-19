import * as React from 'react';
import { useState } from 'react';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/AppNavbar';
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import AppTheme from '../shared-theme/AppTheme';

// Import your different components for each section
import TrackerContent from '@renderer/view/Tracker/Tracker'; // New component for Tracker
import ManageProjectsContent from '@renderer/view/Projects/Projects'; // New component for Manage Projects
import HistoryContent from '@renderer/view/History/History'; // New component for History
import TasksContent from '@renderer/view/Tasks/Tasks'; // New component for History

const xThemeComponents = {};

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  // State to track which menu item is selected
  const [selectedMenu, setSelectedMenu] = useState('Tracker');

  // Function to render the correct component based on selectedMenu
  const renderMainContent = () => {
    switch (selectedMenu) {
      case 'Tracker':
        return <TrackerContent />;
      case 'Projects':
        return <ManageProjectsContent />;
      case 'Tasks':
        return <TasksContent />;
      case 'History':
        return <HistoryContent />;
      default:
        return <TrackerContent />; // Default to Tracker if no match
    }
  };

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            // @ts-ignore
            backgroundColor: theme.vars ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)` : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header selectedMenu={selectedMenu} />
            {/* Hero Section - Render based on selected menu */}
            <Box sx={{ width: '100%', height: '100vh', maxWidth: { sm: '100%', md: '1700px' } }}>{renderMainContent()}</Box>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
