import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { getCurrentUser } from "../../api/user";
import {
  addProject,
  getAllProjects,
  addMember as addMemberAPI,
} from "../../api/project"; // Import the new API function

function Projects() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [adminId, setAdminId] = useState("");
  const [projects, setProjects] = useState([]); // State to hold projects
  const [selectedProjectId, setSelectedProjectId] = useState(""); // State for selected project

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await getCurrentUser(token);
          setAdminId(response.data.foundUser._id);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await getAllProjects();
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchUserInfo();
    fetchProjects();
  }, []);

  const createProject = async (e) => {
    e.preventDefault();
    try {
      const response = await addProject({ name, description, admin: adminId });
      console.log("Project created:", response.data);
      // Optionally reset form fields after creating a project
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const addMember = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      if (!selectedProjectId) {
        console.error("Project ID is not set");
        return;
      }
      const response = await addMemberAPI(selectedProjectId, {
        email,
        adminId,
      });
      console.log("Member added:", response.data);
      // Reset fields after adding member
      setEmail("");
      setSelectedProjectId("");
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Create Project
          </h2>
          <input
            type="text"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 mb-4 text-gray-900 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 mb-4 text-gray-900 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={createProject}
            className="w-full p-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Project
          </button>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Add Member to Project
          </h2>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full p-3 mb-4 text-gray-900 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a Project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 text-gray-900 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addMember}
            className="w-full p-3 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Add Member
          </button>
        </div>
      </div>
    </div>
  );
}

export default Projects;
