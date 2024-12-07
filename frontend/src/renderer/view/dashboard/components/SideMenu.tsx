import * as React from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import SelectContent from './SelectContent';
import CardAlert from './CardAlert';
import OptionsMenu from './OptionsMenu';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';

import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'; 
import HistoryIcon from '@mui/icons-material/History'; 
import TaskAltIcon from '@mui/icons-material/TaskAlt'; 
import { useTheme } from '@mui/material/styles';

interface SideMenuProps {
  setSelectedMenu: (menuItem: string) => void; 
  selectedMenu: string;
}

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

const mainListItems = [
  { text: 'Tracker', icon: <TrackChangesIcon /> },
  { text: 'Projects', icon: <WorkOutlineIcon /> },
  { text: 'Tasks', icon: <TaskAltIcon /> },
  { text: 'History', icon: <HistoryIcon /> },
];

const secondaryListItems = [
  { text: 'About', icon: <InfoRoundedIcon /> },
  { text: 'Feedback', icon: <HelpRoundedIcon /> },
];

export default function SideMenu({ setSelectedMenu,selectedMenu }: SideMenuProps) {
  const theme = useTheme(); 
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
        }}
      >
        <SelectContent />
      </Box>
      <Divider />
      <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
        <List dense>
          {mainListItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => setSelectedMenu(item.text)}
                selected={selectedMenu === item.text}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
                    color: theme.palette.mode === 'light' ? 'black' : 'white', // Black in light mode, white in dark mode
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.mode === 'light' ? 'black' : 'white',
                    },
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                  color: theme.palette.text.primary, // Default text color
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover, // Hover effect for non-selected items
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <List dense>
          {secondaryListItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Stack>
      {/* <CardAlert /> */}
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar sizes="small" alt="Riley Carter" src="/static/images/avatar/7.jpg" sx={{ width: 36, height: 36 }} />
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            Riley Carter
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            riley@email.com
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
