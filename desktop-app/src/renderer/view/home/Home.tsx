import React from 'react';
import { Box, Card, Typography, SvgIcon, Button } from '@mui/material'; 
import { Link } from 'react-router-dom'; 
import Dashboard from '../dashboard/Dashboard';

function HeroSection() {
  return (
    // <Box sx={{ mx: 10, my: 5 }}>
    //   {/* Flex container for hero cards */}
    //   <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
    //     {/* Projects Card */}
    //     <Link to="/projects" style={{ textDecoration: 'none' }}>
    //       <Card
    //         variant="outlined"
    //         sx={{
    //           maxWidth: 300,
    //           p: 3,
    //           display: 'flex',
    //           alignItems: 'center',
    //           gap: 2,
    //           backgroundColor: 'background.paper',
    //           boxShadow: 3,
    //         }}
    //       >
    //         <SvgIcon>
    //           <path d="M18 5h-.7c.229-.467.349-.98.351-1.5a3.5 3.5 0 0 0-3.5-3.5c-1.717 0-3.215 1.2-4.331 2.481C8.4.842 6.949 0 5.5 0A3.5 3.5 0 0 0 2 3.5c.003.52.123 1.033.351 1.5H2a2 2 0 0 0-2 2v3a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V7a2 2 0 0 0-2-2ZM8.058..." />
    //         </SvgIcon>
    //         <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
    //           Projects
    //         </Typography>
    //       </Card>
    //     </Link>

    //     {/* Tracker Card */}
    //     <Link to="/tracker" style={{ textDecoration: 'none' }}>
    //       <Card
    //         variant="outlined"
    //         sx={{
    //           maxWidth: 300,
    //           p: 3,
    //           display: 'flex',
    //           alignItems: 'center',
    //           gap: 2,
    //           backgroundColor: 'background.paper',
    //           boxShadow: 3,
    //         }}
    //       >
    //         <SvgIcon>
    //           <path d="M18..." />
    //         </SvgIcon>
    //         <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
    //           Tracker
    //         </Typography>
    //       </Card>
    //     </Link>

    //     {/* Tasks Card */}
    //     <Link to="/tasks" style={{ textDecoration: 'none' }}>
    //       <Card
    //         variant="outlined"
    //         sx={{
    //           maxWidth: 300,
    //           p: 3,
    //           display: 'flex',
    //           alignItems: 'center',
    //           gap: 2,
    //           backgroundColor: 'background.paper',
    //           boxShadow: 3,
    //         }}
    //       >
    //         <SvgIcon>
    //           <path d="M18..." />
    //         </SvgIcon>
    //         <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
    //           Tasks
    //         </Typography>
    //       </Card>
    //     </Link>
    //   </Box>
    // </Box>
    <Dashboard/>
  );
}

export default HeroSection;
