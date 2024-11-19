import React, { useState, useEffect } from 'react';
import { getAllProjects } from '../../api/project';
import { getCurrentUser } from '../../api/user';
import { addActivity } from '../../api/activity';

interface Project {
  _id: string;
  name: string;
}

interface AlertData {
  projectName: string;
  totalActiveTime: { hours: number; minutes: number; seconds: number };
  percentageActivity: number;
  screenshots: string[];
}

const Tracker = () => {
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

  const interval = 2000; // Screenshot capture interval

  // Fetch projects and user info on initial render
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getAllProjects();
        setProjects(response.data.projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await getCurrentUser(token);
          setUserId(response.data.foundUser._id);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchProjects();
    fetchUserInfo();
  }, []);

  // Activity tracking effect
useEffect(() => {
  if (!isTracking) return;

  // Track mouse movement
  const handleMouseMove = (e: MouseEvent) => {
    setMouseActivity((prev) => [
      ...prev,
      {
        x: e.screenX,
        y: e.screenY,
        timestamp: new Date(),
      },
    ]);
    setLastActivityTime(new Date());
  };

  // Track keyboard activity
  const handleKeyPress = (e: KeyboardEvent) => {
    setKeyboardActivity((prev) => [...prev, e.key]);
    setLastActivityTime(new Date());
  };

  // Screenshot capture function
const captureScreenshot = async () => {
  try {
    const sources = await window.electronAPI.captureScreenshot();
    if (sources && sources.length > 0) {
      const screenshot = sources[0].dataURL;
      setScreenshots((prev) => [...prev, screenshot]);
    }
  } catch (error) {
    console.error('Screenshot capture error:', error);
  }
};

  // Add event listeners
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('keydown', handleKeyPress);

  // Set up intervals
  const screenshotInterval = setInterval(captureScreenshot, interval);
  const durationInterval = setInterval(() => {
    setActiveDuration((prev) => prev + 1000);
  }, 1000);

  // Cleanup function
  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('keydown', handleKeyPress);
    clearInterval(screenshotInterval);
    clearInterval(durationInterval);
  };
}, [isTracking, interval]);

  // Start tracking function
  const startTracking = async () => {
    if (!projectId) return;

    setIsTracking(true);
    setMouseActivity([]);
    setKeyboardActivity([]);
    setActiveDuration(0);
    setScreenshots([]);
    setLastActivityTime(new Date());
  };

  // Stop tracking function
  const stopTracking = async () => {
    setIsTracking(false);
    await saveMouseAndKeyboardActivity();
  };

  // Save mouse and keyboard activity data
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

      // Format time for alert
      const totalActiveTimeInSeconds = Math.floor(activeDuration / 1000);
      const formattedTime = formatTime(totalActiveTimeInSeconds);

      // Set alert data
      const alertMessage: AlertData = {
        projectName: projects.find((project) => project._id === projectId)?.name || 'N/A',
        totalActiveTime: formattedTime,
        percentageActivity,
        screenshots,
      };

      setAlertData(alertMessage);

      // Reset activity data
      setMouseActivity([]);
      setKeyboardActivity([]);
      setScreenshots([]);
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  };

  // Format time into hours, minutes, and seconds
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return { hours, minutes, seconds: totalSeconds % 60 };
  };

  // Calculate percentage of activity based on mouse movements
  const calculatePercentageActivity = (): number => {
    if (activeDuration === 0 || mouseActivity.length === 0) return 0;

    const totalTrackedIntervals = Math.floor(activeDuration / interval) * (interval / 1000);

    return Math.min((activeDuration / totalTrackedIntervals) * (100 / interval), 100);
  };

  // Close alert modal
  const closeAlert = (): void => {
    setAlertData(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <form className="space-y-4">
        <div>
          <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
            Select Project:
          </label>
          <select
            id="project"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="mt-1 block w-full p-3 mb-4 text-gray-900 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select a project
            </option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={startTracking}
            disabled={isTracking || !projectId}
            className="w-full p-3 mr-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Start Tracking
          </button>
          <button
            type="button"
            onClick={stopTracking}
            disabled={!isTracking}
            className="w-full p-3 ml-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
          >
            Stop Tracking
          </button>
        </div>
      </form>

      {/* Alert Modal */}
      {alertData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto relative">
            <button onClick={closeAlert} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl">
              &times;
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity Summary</h3>
            <p className="text-gray-700 mb-2">
              <strong>Project Name:</strong> {alertData.projectName}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Total Time Worked:</strong> {alertData.totalActiveTime.hours}h {alertData.totalActiveTime.minutes}m {alertData.totalActiveTime.seconds}s
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Activity Percentage:</strong> {alertData.percentageActivity.toFixed(2)}%
            </p>

            <h4 className="text-md font-semibold text-gray-800 mt-4">Screenshots:</h4>
            <div className="mt-2 max-h-64 overflow-y-auto">
              {alertData.screenshots.map((screenshot, index) => (
                <img key={index} src={screenshot} alt={`Screenshot ${index + 1}`} className="w-full h-auto mb-2 rounded shadow" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracker;
