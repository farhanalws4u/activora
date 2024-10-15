import React, { useState, useEffect } from "react";
import axios from "../../api/axiosConfig";
import html2canvas from "html2canvas";
import { getAllProjects } from "../../api/project";
import Navbar from "../../components/Navbar";
import { getCurrentUser } from "../../api/user";
import { addActivity } from "../../api/activity";

const Tracker = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [mouseActivity, setMouseActivity] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [userId, setUserId] = useState("");
  const [projects, setProjects] = useState([]);
  const [activeDuration, setActiveDuration] = useState(0);
  const [screenshots, setScreenshots] = useState([]);
  const [lastActivityTime, setLastActivityTime] = useState(null);
  const [alertData, setAlertData] = useState(null); 
  const interval = 2000;
  console.log({screenshots})

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getAllProjects();
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await getCurrentUser(token);
          setUserId(response.data.foundUser._id);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchProjects();
    fetchUserInfo();
  }, []);

  useEffect(() => {
    let trackingInterval;

    if (isTracking) {
      trackingInterval = setInterval(captureScreenshot, interval);
      document.addEventListener("mousemove", handleMouseMove);
    } else {
      clearInterval(trackingInterval);
      document.removeEventListener("mousemove", handleMouseMove);
    }

    return () => {
      clearInterval(trackingInterval);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isTracking]);

  const handleMouseMove = (event) => {
    const currentTime = new Date();
    setMouseActivity((prev) => [
      ...prev,
      { x: event.clientX, y: event.clientY, timestamp: currentTime },
    ]);

    if (lastActivityTime) {
      setActiveDuration(
        (prevDuration) => prevDuration + (currentTime - lastActivityTime)
      );
    }
    setLastActivityTime(currentTime);
  };

  const captureScreenshot = async () => {
    try {
      const canvas = await html2canvas(document.body);
      const imageData = canvas.toDataURL("image/png");
      setScreenshots((prevScreenshots) => [...prevScreenshots, imageData]);
    } catch (error) {
      console.error("Error capturing screenshot:", error);
    }
  };

  const startTracking = () => {
    setIsTracking(true);
    setMouseActivity([]);
    setActiveDuration(0);
    setScreenshots([]);
    setLastActivityTime(new Date());
  };

  const stopTracking = async () => {
    setIsTracking(false);
    await saveMouseActivity();
    setLastActivityTime(null);
  };

const saveMouseActivity = async () => {
  try {
    const percentageActivity = calculatePercentageActivity();
    const response = await addActivity({
      projectId,
      userId,
      mouseMovement: mouseActivity,
      activeDuration,
      percentageActivity,
      screenshots,
    });

    const totalActiveTime = Math.floor(activeDuration / 1000); 
    const formattedTime = formatTime(totalActiveTime);
    const alertMessage = {
      projectName:
        projects.find((project) => project._id === projectId)?.name || "N/A",
      totalActiveTime: formattedTime,
      percentageActivity,
      screenshots,
    };

    setAlertData(alertMessage); // Set alert data to show
    setMouseActivity([]);
    setScreenshots([]);
  } catch (error) {
    console.error("Error saving mouse activity:", error);
  }
};

const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
};


const calculatePercentageActivity = () => {
  if (activeDuration === 0 || mouseActivity.length === 0) {
    return 0;
  }
  const totalTimeTracked =
    (interval / 1000) * Math.floor(activeDuration / interval); 
  const maxActiveTime = interval * (mouseActivity.length / 1000);
  return Math.min((activeDuration / totalTimeTracked) * 100, 100);
};


  const closeAlert = () => {
    setAlertData(null);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
          Activity Tracker
        </h2>

        <form className="space-y-4">
          <div>
            <label
              htmlFor="project"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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
              <button
                onClick={closeAlert}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl"
              >
                &times;
              </button>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Activity Summary
              </h3>
              <p className="text-gray-700 mb-2">
                <strong>Project Name:</strong> {alertData.projectName}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Total Time Worked:</strong>{" "}
                {alertData.totalActiveTime.hours}h{" "}
                {alertData.totalActiveTime.minutes}m{" "}
                {alertData.totalActiveTime.seconds}s
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Activity Percentage:</strong>{" "}
                {alertData.percentageActivity.toFixed(2)}%
              </p>
              <h4 className="text-md font-semibold text-gray-800 mt-4">
                Screenshots:
              </h4>
              <div className="mt-2 max-h-64 overflow-y-auto">
                {alertData?.screenshots?.map((screenshot, index) => {
                  return (
                    <img
                      key={index}
                      src={screenshot}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-auto mb-2 rounded shadow"
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Tracker;
