import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { getCurrentUser } from '../../api/user';
import { addProject, getAllProjects, addMember as addMemberAPI } from '../../api/project';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Divider, MenuItem, Select, TextField, Typography, CircularProgress } from '@mui/material';

interface Project {
  _id: string;
  name: string;
  description: string;
}

interface User {
  _id: string;
}

interface GetCurrentUserResponse {
  data: {
    foundUser: User;
  };
}

interface GetAllProjectsResponse {
  data: {
    projects: Project[];
  };
}

const Projects: React.FC = () => {
  const theme = useTheme();
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [adminId, setAdminId] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Validation errors

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (token) {
          const response: GetCurrentUserResponse = await getCurrentUser(token);
          setAdminId(response.data.foundUser._id);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response: GetAllProjectsResponse = await getAllProjects();
        setProjects(response.data.projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
    fetchProjects();
  }, []);

  // Yup Validation Schemas
  const createProjectSchema = Yup.object().shape({
    name: Yup.string().required('Project Name is required'),
    description: Yup.string().required('Description is required'),
  });

  const addMemberSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    selectedProjectId: Yup.string().required('Please select a project'),
  });

  const validateForm = async (schema: Yup.ObjectSchema<any>, data: object) => {
    try {
      await schema.validate(data, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err: any) {
      const validationErrors: { [key: string]: string } = {};
      err.inner.forEach((error: Yup.ValidationError) => {
        if (error.path) validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      return false;
    }
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const isValid = await validateForm(createProjectSchema, { name, description });
    if (!isValid) return;

    try {
      setLoading(true);
      const response = await addProject({ name, description, admin: adminId });
      console.log('Project created:', response.data);
      setName('');
      setDescription('');
      setProjects((prevProjects) => [...prevProjects, response.data.project]);
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const isValid = await validateForm(addMemberSchema, { email, selectedProjectId });
    if (!isValid) return;

    try {
      setLoading(true);
      const response = await addMemberAPI(selectedProjectId, { email });
      console.log('Member added:', response.data);
      setEmail('');
      setSelectedProjectId('');
    } catch (error) {
      console.error('Error adding member:', error);
    } finally {
      setLoading(false);
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
      {/* Section: Add Project */}
      <Box component="form" onSubmit={createProject} sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Create a Project
        </Typography>
        <TextField
          label="Project Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={!!errors.description}
          helperText={errors.description}
        />
        <Button variant="contained" type="submit">
          Create Project
        </Button>
      </Box>

      <Divider />

      {/* Section: Add Member */}
      <Box component="form" onSubmit={addMember} sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Add a Member
        </Typography>
        <Select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          displayEmpty
          fullWidth
          variant="outlined"
          error={!!errors.selectedProjectId}
        >
          <MenuItem value="">Select a Project</MenuItem>
          {projects.map((project) => (
            <MenuItem key={project._id} value={project._id}>
              {project.name}
            </MenuItem>
          ))}
        </Select>
        <Typography variant="body2" color="error">
          {errors.selectedProjectId}
        </Typography>
        <TextField
          label="Member Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
        />
        <Button variant="contained" type="submit">
          Add Member
        </Button>
      </Box>
    </Box>
  );
};

export default Projects;
