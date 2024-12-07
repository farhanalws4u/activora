import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, MenuItem, TextField, Typography } from '@mui/material';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

interface Member {
  user: string;
  role: string;
  joinedAt?: string;
}

interface Attachment {
  name: string;
  url: string;
  uploadedBy?: string;
  uploadedAt?: string;
}

interface Milestone {
  name: string;
  dueDate?: string;
  status: string;
}

interface Comment {
  text: string;
  author?: string;
  createdAt?: string;
}

interface ProjectFormValues {
  id?:string;
  name: string;
  description?: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
  category: string;
  progress?: number;
  members?: Member[];
  attachments?: Attachment[];
  milestones?: Milestone[];
}

// Initial values for the form
const initialValues: ProjectFormValues = {
  name: '',
  description: '',
  status: 'Planning',
  priority: 'Medium',
  startDate: '',
  endDate: '',
  category: 'Other',
  progress: undefined,
  members: [],
  attachments: [],
  milestones: [],
};

const validationSchema = Yup.object({
  name: Yup.string().required('Project name is required').max(255),
  description: Yup.string().max(500, 'Description cannot exceed 500 characters'),
  status: Yup.string().oneOf(['Planning', 'Active', 'On Hold', 'Completed']).required('Status is required'),
  priority: Yup.string().oneOf(['Low', 'Medium', 'High']).required('Priority is required'),
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date().required('End date is required').min(Yup.ref('startDate'), 'End date must be after start date'),
  category: Yup.string().oneOf(['Development', 'Design', 'Marketing', 'Other']).required('Category is required'),

  progress: Yup.number().min(0).max(100, 'Progress must be between 0 and 100'),
  members: Yup.array().of(
    Yup.object({
      user: Yup.string(), 
      role: Yup.string().oneOf(['Admin', 'Member']), 
      joinedAt: Yup.date(), 
    }),
  ),
  attachments: Yup.array().of(
    Yup.object({
      name: Yup.string(), 
      url: Yup.string().url('Invalid URL'), 
      uploadedBy: Yup.string(), 
      uploadedAt: Yup.date(), 
    }),
  ),
  milestones: Yup.array().of(
    Yup.object({
      name: Yup.string(), 
      dueDate: Yup.date(),
      status: Yup.string().oneOf(['Pending', 'Completed']), 
    }),
  ),
});

// Props for the ProjectForm component
interface ProjectFormProps {
  project: ProjectFormValues;
  onClose: () => void;
  isOpen: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onClose, isOpen }) => {
  const [initialState, setInitialState] = useState<ProjectFormValues>(initialValues);

  // Fetch project details for edit flow
  useEffect(() => {
    if (project?.id) {
      axios.get(`/api/projects/${project?.id}`).then((response) => {
        const project = response.data.project;

        setInitialState({
          name: project.name,
          description: project.description || '',
          status: project.status,
          priority: project.priority,
          startDate: project.startDate.split('T')[0],
          endDate: project.endDate.split('T')[0],
          category: project.category,
          progress: project.progress || undefined,
          members: project.members || [],
          attachments: project.attachments || [],
          milestones: project.milestones || [],
        });
      });
    }
  }, [project?.id]);

  const handleSubmit = async (values: ProjectFormValues) => {
    try {
      if (project?.id) {
        await axios.put(`/api/projects/${project?.id}`, values);
      } else {
        await axios.post('/api/projects', values);
      }
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        {project?.id ? 'Edit Project' : 'Add New Project'}
        <DialogContent dividers>
          <Formik initialValues={initialState} enableReinitialize validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ values, errors, touched, handleChange }) => (
              <Form>
                <Box display="flex" flexDirection="column" gap={2}>
                  {/* Basic Fields */}
                  <TextField
                    label="Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    fullWidth
                  />
                  <TextField label="Description" name="description" value={values.description} onChange={handleChange} multiline rows={3} fullWidth />
                  <TextField select label="Status" name="status" value={values.status} onChange={handleChange} fullWidth>
                    {['Planning', 'Active', 'On Hold', 'Completed'].map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField select label="Priority" name="priority" value={values.priority} onChange={handleChange} fullWidth>
                    {['Low', 'Medium', 'High'].map((priority) => (
                      <MenuItem key={priority} value={priority}>
                        {priority}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    type="date"
                    label="Start Date"
                    name="startDate"
                    value={values.startDate}
                    onChange={handleChange}
                    error={touched.startDate && Boolean(errors.startDate)}
                    helperText={touched.startDate && errors.startDate}
                    fullWidth
                  />
                  <TextField
                    type="date"
                    label="End Date"
                    name="endDate"
                    value={values.endDate}
                    onChange={handleChange}
                    error={touched.endDate && Boolean(errors.endDate)}
                    helperText={touched.endDate && errors.endDate}
                    fullWidth
                  />
                  <TextField select label="Category" name="category" value={values.category} onChange={handleChange} fullWidth>
                    {['Development', 'Design', 'Marketing', 'Other'].map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    type="number"
                    label="Progress (%)"
                    name="progress"
                    value={values.progress || ''}
                    onChange={(e) =>
                      handleChange({
                        target: { name: e.target.name, value: Number(e.target.value) },
                      })
                    }
                  />

                  {/* Members Field */}
                  <Typography variant="h6">Members</Typography>
                  <FieldArray name="members">
                    {({ push, remove }) => (
                      <>
                        {values.members?.map((member, index) => (
                          <Box key={index} display="flex" gap={2}>
                            <TextField label={`Member ${index + 1} User ID`} name={`members[${index}].user`} value={member.user} onChange={handleChange} />
                            <TextField
                              select
                              label={`Member ${index + 1} Role`}
                              name={`members[${index}].role`}
                              value={member.role || ''}
                              onChange={handleChange}
                            >
                              {['Admin', 'Member'].map((role) => (
                                <MenuItem key={role} value={role}>
                                  {role}
                                </MenuItem>
                              ))}
                            </TextField>
                            <Button variant="outlined" color="error" onClick={() => remove(index)}>
                              Remove
                            </Button>
                          </Box>
                        ))}
                        <Button variant="contained" onClick={() => push({ user: '', role: '' })}>
                          Add Member
                        </Button>
                      </>
                    )}
                  </FieldArray>

                  {/* Attachments Field */}
                  <Typography variant="h6">Attachments</Typography>
                  <FieldArray name="attachments">
                    {({ push, remove }) => (
                      <>
                        {values.attachments?.map((attachment, index) => (
                          <Box key={index} display="flex" gap={2}>
                            <TextField
                              label={`Attachment ${index + 1} Name`}
                              name={`attachments[${index}].name`}
                              value={attachment.name || ''}
                              onChange={handleChange}
                            />
                            <TextField
                              label={`Attachment ${index + 1} URL`}
                              name={`attachments[${index}].url`}
                              value={attachment.url || ''}
                              onChange={handleChange}
                            />
                            <Button variant="outlined" color="error" onClick={() => remove(index)}>
                              Remove
                            </Button>
                          </Box>
                        ))}
                        <Button variant="contained" onClick={() => push({ name: '', url: '' })}>
                          Add Attachment
                        </Button>
                      </>
                    )}
                  </FieldArray>

                  {/* Milestones Field */}
                  <Typography variant="h6">Milestones</Typography>
                  <FieldArray name="milestones">
                    {({ push, remove }) => (
                      <>
                        {values.milestones?.map((milestone, index) => (
                          <Box key={index} display="flex" gap={2}>
                            <TextField
                              label={`Milestone ${index + 1} Name`}
                              name={`milestones[${index}].name`}
                              value={milestone.name || ''}
                              onChange={handleChange}
                            />
                            <TextField
                              type="date"
                              label={`Milestone ${index + 1} Due Date`}
                              name={`milestones[${index}].dueDate`}
                              value={(milestone.dueDate || '').split('T')[0]}
                              onChange={handleChange}
                            />
                            <TextField
                              select
                              label={`Milestone ${index + 1} Status`}
                              name={`milestones[${index}].status`}
                              value={milestone.status || ''}
                              onChange={handleChange}
                            >
                              {['Pending', 'Completed'].map((status) => (
                                <MenuItem key={status} value={status}>
                                  {status}
                                </MenuItem>
                              ))}
                            </TextField>
                            <Button variant="outlined" color="error" onClick={() => remove(index)}>
                              Remove
                            </Button>
                          </Box>
                        ))}
                        <Button variant="contained" onClick={() => push({ name: '', status: '' })}>
                          Add Milestone
                        </Button>
                      </>
                    )}
                  </FieldArray>
                </Box>

                {/* Submit and Cancel Buttons */}
                <Box display="flex" justifyContent="flex-end" mt={3}>
                  <Button variant="outlined" onClick={onClose} sx={{ mr: 2 }}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained">
                    {project?.id ? 'Update Project' : 'Create Project'}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </DialogTitle>
    </Dialog>
  );
};

export default ProjectForm;
