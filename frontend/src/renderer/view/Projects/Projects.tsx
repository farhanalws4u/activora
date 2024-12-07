import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import { Add as AddIcon, FilterList as FilterListIcon, Search, ArrowUpward, ArrowDownward, Remove, Edit, RemoveRedEyeRounded } from '@mui/icons-material';
import _ from 'lodash';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { Divider } from 'antd';
import ProjectForm from './ProjectForm';

// Define types for project data
interface Project {
  id: string;
  name: string;
  status: 'Planning' | 'Active' | 'On Hold' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  category: 'Development' | 'Design' | 'Marketing' | 'Other';
  startDate: string;
  endDate: string;
  progress: number;
}

interface Filters {
  category: string;
  priority: string;
  status: string;
  sortBy: string;
}

const ProjectManagement: React.FC = () => {
  const theme = useTheme();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectModal, setShowProjectModal] = useState<boolean>(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState<boolean>(false);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

  const [filters, setFilters] = useState<Filters>({ category: '', priority: '', status: '', sortBy: '' });

  const [searchTerm, setSearchTerm] = useState<string>('');

  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Project Alpha',
      status: 'Active',
      priority: 'High',
      category: 'Development',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      progress: 50,
    },
    {
      id: '2',
      name: 'Project Beta',
      status: 'Planning',
      priority: 'Medium',
      category: 'Design',
      startDate: '2024-02-01',
      endDate: '2024-11-30',
      progress: 20,
    },
    {
      id: '3',
      name: 'Project Gamma',
      status: 'Completed',
      priority: 'Low',
      category: 'Marketing',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      progress: 100,
    },
    { id: '4', name: 'Project Delta', status: 'On Hold', priority: 'High', category: 'Other', startDate: '2024-03-01', endDate: '2024-10-31', progress: 10 },
    {
      id: '5',
      name: 'Project Epsilon',
      status: 'Active',
      priority: 'Medium',
      category: 'Development',
      startDate: '2024-04-01',
      endDate: '2024-09-30',
      progress: 75,
    },
  ]);

  useEffect(() => {
    fetchProjects();
  }, [filters, searchTerm]);

  const fetchProjects = async () => {
    try {
      // const response = await axios.get('/api/projects', {
      //   params: { ...filters, searchTerm }
      // });
      // setProjects(response.data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleOpenProjectModal = (project: Project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  const handleCloseProjectModal = () => {
    setSelectedProject(null);
    setShowProjectModal(false);
  };

  const handleOpenAddProjectModal = () => {
    setShowAddProjectModal(true);
  };

  const handleCloseAddProjectModal = () => {
    setShowAddProjectModal(false);
  };

  const handleOpenFilterModal = () => {
    setShowFilterModal(true);
  };

  const handleCloseFilterModal = () => {
    setShowFilterModal(false);
    fetchProjects();
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High':
        return <ArrowUpward color="error" />;
      case 'Medium':
        return <Remove color="warning" />;
      case 'Low':
        return <ArrowDownward color="success" />;
      default:
        return null;
    }
  };

  const debouncedSearch = _.debounce((value: any) => {
    setSearchTerm(value);
  }, 300);

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <TextField
          placeholder="Search Project..."
          size="small"
          onChange={(e) => debouncedSearch(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ width: '40%' }}
        />
        <Box>
          <Button variant="outlined" startIcon={<FilterListIcon />} onClick={handleOpenFilterModal}>
            {' '}
            Filters{' '}
          </Button>
          <Button sx={{ ml: 2 }} variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddProjectModal}>
            {' '}
            Add Project{' '}
          </Button>
        </Box>
      </Box>
      <Paper sx={{ textAlign: 'center' }}>
        <TableContainer component={Box} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200] }}>
                <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>Start Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>End Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>Progress</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id} sx={{ '& > *': { borderBottom: 'unset' }, '& td': { borderBottom: '0.1px solid #e0e0e0' } }}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.status}</TableCell>
                  <Tooltip title={project.priority}>
                    <TableCell>{getPriorityIcon(project.priority)}</TableCell>
                  </Tooltip>
                  <TableCell>{project.category}</TableCell>
                  <TableCell>{project.startDate}</TableCell>
                  <TableCell>{project.endDate}</TableCell>
                  <Tooltip title={project.progress + '%'}>
                    <TableCell>
                      <LinearProgress variant="determinate" value={project.progress} />
                    </TableCell>
                  </Tooltip>{' '}
                  {/* Progress Bar */}
                  <TableCell>
                    <Button sx={{ mr: 1 }} size="small" variant="contained" startIcon={<Edit />}>
                      {' '}
                      Edit
                    </Button>

                    <Button sx={{ mr: 1 }} size="small" variant="outlined" startIcon={<RemoveRedEyeRounded />} onClick={handleOpenProjectModal}>
                      {' '}
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Project Details Modal */}
      {selectedProject && (
        <Dialog open={showProjectModal} onClose={handleCloseProjectModal}>
          <DialogTitle>Project Details</DialogTitle>
          <DialogContent dividers>
            {/* Display project details here */}
            <Typography>Name:{selectedProject.name}</Typography>

            {/* Add more fields as needed */}
          </DialogContent>
          <DialogActions>
            {' '}
            <Button onClick={handleCloseProjectModal}>Close </Button>
          </DialogActions>{' '}
        </Dialog>
      )}

      {/* Add Project Modal */}
      <ProjectForm isOpen={showAddProjectModal} project={selectedProject} onClose={handleCloseAddProjectModal} />

      {/* Filter Modal */}
      <Dialog open={showFilterModal} onClose={handleCloseFilterModal}>
        <DialogTitle>Apply Filters </DialogTitle>

        <DialogContent dividers>
          {/* Category Filter */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Category </InputLabel>

            <Select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
              <MenuItem value="">All Categories </MenuItem>
              <MenuItem value="Development">Development </MenuItem>
              <MenuItem value="Design">Design </MenuItem>
              <MenuItem value="Marketing">Marketing </MenuItem>
              <MenuItem value="Other">Other </MenuItem>
            </Select>
          </FormControl>

          {/* Priority Filter */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Priority </InputLabel>

            <Select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
              <MenuItem value="">All Priorities </MenuItem>
              <MenuItem value="Low">Low </MenuItem>
              <MenuItem value="Medium">Medium </MenuItem>
              <MenuItem value="High">High </MenuItem>
            </Select>
          </FormControl>

          {/* Status Filter */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Status </InputLabel>

            <Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <MenuItem value="">All Statuses </MenuItem>
              <MenuItem value="Planning">Planning </MenuItem>
              <MenuItem value="Active">Active </MenuItem>
              <MenuItem value="On Hold">On Hold </MenuItem>
              <MenuItem value="Completed">Completed </MenuItem>
            </Select>
          </FormControl>

          {/* Sorting Options */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Sort By </InputLabel>

            <Select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}>
              <MenuItem value="">None </MenuItem>
              <MenuItem value="startDate">Start Date </MenuItem>
              <MenuItem value="endDate">End Date </MenuItem>
              <MenuItem value="progress">Progress </MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        {/* Apply and Reset Filters */}
        <DialogActions>
          {' '}
          <Button
            onClick={() => {
              setFilters({ category: '', priority: '', status: '', sortBy: '' });
            }}
          >
            Reset Filters{' '}
          </Button>
          <Button variant="contained" onClick={handleCloseFilterModal}>
            Apply Filters{' '}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProjectManagement;
