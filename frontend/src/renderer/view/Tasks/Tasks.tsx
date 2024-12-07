import React, { useState, useEffect } from 'react';
// import { format } from 'date-fns';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { Add as AddIcon, FilterList as FilterListIcon, Search as SearchIcon, FolderOpen as ProjectIcon } from '@mui/icons-material';

interface Project {
  _id: string;
  name: string;
}

interface Task {
  _id: string;
  projectId: string;
  name: string;
  description: string;
  status: 'Draft' | 'Planned' | 'Started' | 'Blocked' | 'Complete' | 'Deferred';
  priority: 'P1' | 'P2' | 'P3' ;
  assignedTo: string;
  startDate: Date;
  dueDate: Date;
  estimatedHours: number;
  actualHours: number;
  percentageComplete: number;
  attachments: string[];
  tags: string[];
}

const Tasks: React.FC = () => {
  const theme = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [newTask, setNewTask] = useState({
    projectId: '',
    name: '',
    description: '',
    status: 'Draft',
    priority: 'P3',
    startDate: '',
    dueDate: '',
    estimatedHours: 0,
  });

  // Fetch projects on component mount
  useEffect(() => {
    // Add your API call to fetch projects
    // setProjects(fetchedProjects);
  }, []);

  // Fetch tasks when selected project changes
  useEffect(() => {
    if (selectedProject) {
      // Add your API call to fetch tasks for selected project
      // setTasks(fetchedTasks);
    }
  }, [selectedProject]);

  const handleProjectChange = (event: SelectChangeEvent) => {
    setSelectedProject(event.target.value);
  };

  const handleNewTaskChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
      <Paper elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="xl">
          <Box sx={{ py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" component="h1">
              Manage Tasks
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowAddTask(true)} disabled={!selectedProject}>
              New Task
            </Button>
          </Box>

          <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)}>
            <Tab label="All Tasks" />
            <Tab label="Active" />
            <Tab label="Completed" />
          </Tabs>
        </Container>
      </Paper>

      <Container maxWidth="xl" sx={{ mt: 3 }}>
        {/* Project Selection and Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Select Project</InputLabel>
                <Select value={selectedProject} onChange={handleProjectChange} label="Select Project" startAdornment={<ProjectIcon sx={{ mr: 1 }} />}>
                  {projects.map((project) => (
                    <MenuItem key={project._id} value={project._id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search tasks..."
                size="small"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select label="Status" defaultValue="">
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Started">Started</MenuItem>
                  <MenuItem value="Complete">Complete</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select label="Priority" defaultValue="">
                  <MenuItem value="">All Priority</MenuItem>
                  <MenuItem value="P1">P1</MenuItem>
                  <MenuItem value="P2">P2</MenuItem>
                  <MenuItem value="P3">P3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Task List or Project Selection Message */}
        {!selectedProject ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <ProjectIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Please select a project to view its tasks
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {tasks.map((task) => (
              <Card key={task._id}>
                <CardContent>{/* Task card content remains the same */}</CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>

      {/* Add Task Dialog */}
      <Dialog open={showAddTask} onClose={() => setShowAddTask(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth disabled>
                  <InputLabel>Project</InputLabel>
                  <Select value={selectedProject} label="Project">
                    <MenuItem value={selectedProject}>{projects.find((p) => p._id === selectedProject)?.name}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Task Name" name="name" value={newTask.name} onChange={handleNewTaskChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Description" name="description" value={newTask.description} onChange={handleNewTaskChange} multiline rows={3} />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={newTask.startDate}
                  onChange={handleNewTaskChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Due Date"
                  name="dueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={handleNewTaskChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Estimated Hours"
                  name="estimatedHours"
                  type="number"
                  value={newTask.estimatedHours}
                  onChange={handleNewTaskChange}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    name="priority"
                    value={newTask.priority}
                    onChange={(e) => handleNewTaskChange(e as React.ChangeEvent<HTMLInputElement>)}
                    label="Priority"
                  >
                    <MenuItem value="P1">P1</MenuItem>
                    <MenuItem value="P2">P2</MenuItem>
                    <MenuItem value="P3">P3</MenuItem>
                    <MenuItem value="P4">P4</MenuItem>
                    <MenuItem value="P5">P5</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddTask(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              // Add your API call to create new task
              // createTask({ ...newTask, projectId: selectedProject });
              setShowAddTask(false);
            }}
          >
            Create Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tasks;
