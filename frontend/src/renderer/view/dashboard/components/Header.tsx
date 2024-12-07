import * as React from 'react';
import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import MenuButton from './MenuButton';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';
import Search from './Search';
import { Divider, Typography } from 'antd';
import { useTheme } from '@mui/material/styles';

interface HeaderProps {
  selectedMenu: string; // Add selectedMenu prop to display in header
}

export default function Header({ selectedMenu }: HeaderProps) {
  // Get the current theme
  const theme = useTheme();

  return (
    <>
      <Stack
        direction="row"
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '100%',
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          maxWidth: { sm: '100%', md: '1700px' },
          pt: 1.5,
        }}
        spacing={2}
      >
        {/* Display selected menu as heading with dynamic color */}
        <Typography.Title
          level={2}
          style={{
            margin: 0,
            color: theme.palette.mode === 'dark' ? '#fff' : '#000', // Dynamic text color
          }}
        >
          {selectedMenu}
        </Typography.Title>

        <Stack direction="row" sx={{ gap: 1 }}>
          {/* <Search /> */}
          <MenuButton showBadge aria-label="Open notifications">
            <NotificationsRoundedIcon />
          </MenuButton>
          <ColorModeIconDropdown />
        </Stack>
      </Stack>
      {/* Updated Divider */}
      <Divider
        style={{
          borderColor: theme.palette.mode === 'dark' ? theme.palette.divider : '#000',
        }}
      />
    </>
  );
}
