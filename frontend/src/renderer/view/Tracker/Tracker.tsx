import React, { useState, useEffect } from 'react';
import { getAllProjects } from '../../api/project';
import { getCurrentUser } from '../../api/user';
import { addActivity } from '../../api/activity';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Select, MenuItem, Typography, CircularProgress, Modal } from '@mui/material';

interface Project {
  _id: string;
  name: string;
}

interface AlertData {
  projectName: string;
  totalActiveTime: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  percentageActivity: number;
  screenshots: string[];
}

const Tracker: React.FC = () => {
  const theme = useTheme();
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [mouseActivity, setMouseActivity] = useState<{ x: number; y: number; timestamp: Date }[]>([]);
  const [keyboardActivity, setKeyboardActivity] = useState<string[]>([]);
  const [projectId, setProjectId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeDuration, setActiveDuration] = useState<number>(0);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [lastActivityTime, setLastActivityTime] = useState<Date | null>(null);
  const [alertData, setAlertData] = useState<AlertData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [stopTrackingLoading, setStopTrackingLoading] = useState<boolean>(false);

  const interval = 2000;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [projectsResponse, userResponse] = await Promise.all([getAllProjects(), getCurrentUser(localStorage.getItem('token') || '')]);
        setProjects(projectsResponse.data.projects);
        setUserId(userResponse.data.foundUser._id);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Activity tracking effect remains the same as your original code
  useEffect(() => {
    if (!isTracking) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMouseActivity((prev) => [...prev, { x: e.screenX, y: e.screenY, timestamp: new Date() }]);
      setLastActivityTime(new Date());
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      setKeyboardActivity((prev) => [...prev, e.key]);
      setLastActivityTime(new Date());
    };

    const captureScreenshot = async () => {
      try {
        const sources = await window.electronAPI.captureScreenshot();
        if (sources && sources.length > 0) {
          setScreenshots((prev) => [...prev, sources[0].dataURL]);
        }
      } catch (error) {
        console.error('Screenshot capture error:', error);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyPress);

    const screenshotInterval = setInterval(captureScreenshot, interval);
    const durationInterval = setInterval(() => {
      setActiveDuration((prev) => prev + 1000);
    }, 1000);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyPress);
      clearInterval(screenshotInterval);
      clearInterval(durationInterval);
    };
  }, [isTracking]);

  // Your helper functions remain the same
  const startTracking = async () => {
    if (!projectId) return;
    setIsTracking(true);
    setMouseActivity([]);
    setKeyboardActivity([]);
    setActiveDuration(0);
    setScreenshots([]);
    setLastActivityTime(new Date());
  };

const stopTracking = async () => {
  setStopTrackingLoading(true);
  setIsTracking(false);
  try {
    await saveMouseAndKeyboardActivity();
  } finally {
    setStopTrackingLoading(false);
  }
};

  // Other helper functions remain the same
  const calculatePercentageActivity = (): number => {
    if (activeDuration === 0 || mouseActivity.length === 0) return 0;
    const totalTrackedIntervals = Math.floor(activeDuration / interval) * (interval / 1000);
    return Math.min((activeDuration / totalTrackedIntervals) * (100 / interval), 100);
  };

  const formatTime = (totalSeconds: number) => ({
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  });

  const saveMouseAndKeyboardActivity = async (): Promise<void> => {
    try {
      const percentageActivity = calculatePercentageActivity();
      await addActivity({
        projectId,
        userId,
        mouseMovement: mouseActivity,
        keyboardActivity,
        activeDuration,
        percentageActivity,
        screenshots,
      });

      const totalActiveTimeInSeconds = Math.floor(activeDuration / 1000);
      const formattedTime = formatTime(totalActiveTimeInSeconds);

      setAlertData({
        projectName: projects.find((project) => project._id === projectId)?.name || 'N/A',
        totalActiveTime: formattedTime,
        percentageActivity,
        screenshots,
      });

      setMouseActivity([]);
      setKeyboardActivity([]);
      setScreenshots([]);
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        borderRadius: 3,
        padding: theme.spacing(3),
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        mt: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(3),
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Select Project
      </Typography>
      <Select value={projectId} onChange={(e) => setProjectId(e.target.value)} displayEmpty fullWidth variant="outlined">
        <MenuItem value="" disabled>
          Select a Project
        </MenuItem>
        {projects.map((project) => (
          <MenuItem key={project._id} value={project._id}>
            {project.name}
          </MenuItem>
        ))}
      </Select>
      <Box sx={{ display: 'flex', gap: theme.spacing(2) }}>
        <Button variant="contained" onClick={startTracking} disabled={isTracking || !projectId} fullWidth color="primary">
          Start Tracking
        </Button>
        <Button variant="contained" onClick={stopTracking} disabled={!isTracking} fullWidth color="error">
          Stop Tracking
        </Button>
      </Box>

      <Modal open={!!alertData} onClose={() => setAlertData(null)} aria-labelledby="activity-summary">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            // @ts-ignore 
            position: 'relative', 
          }}
        >
          <Button
            onClick={() => setAlertData(null)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
              minWidth: 'auto',
              padding: '4px',
            }}
          >
            ✕
          </Button>

          <Typography variant="h6" component="h2" gutterBottom>
            Activity Summary
          </Typography>
          {alertData && (
            <>
              <Typography sx={{ mt: 2 }}>
                <strong>Project Name:</strong> {alertData.projectName}
              </Typography>
              <Typography>
                <strong>Total Time Worked:</strong> {alertData.totalActiveTime.hours}h {alertData.totalActiveTime.minutes}m {alertData.totalActiveTime.seconds}s
              </Typography>
              <Typography>
                <strong>Activity Percentage:</strong> {alertData.percentageActivity.toFixed(2)}%
              </Typography>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Screenshots:
              </Typography>
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {alertData.screenshots.map((screenshot, index) => (
                  <img
                    key={index}
                    src={screenshot}
                    alt={`Screenshot ${index + 1}`}
                    style={{
                      width: '100%',
                      marginBottom: theme.spacing(1),
                      borderRadius: theme.shape.borderRadius,
                    }}
                  />
                ))}
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Tracker;
