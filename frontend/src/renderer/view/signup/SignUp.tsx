import * as React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { CircularProgress, FormHelperText } from '@mui/material';
import { useNavigate } from 'react-router';
import { signUp } from '../../api/auth';
import AppTheme from '../shared-theme/AppTheme';
import { GoogleIcon } from './CustomIcons';
import ColorModeSelect from '../shared-theme/ColorModeSelect';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

interface IFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .matches(/^[A-Za-z\s]{2,100}$/, 'Name must contain only letters and spaces, between 2 and 100 characters')
    .required('Name is required'),
  email: Yup.string()
    .trim()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),  
});

export default function SignUp(props: { disableCustomTheme?: boolean }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const initialValues: IFormData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const handleSubmit = async (values: IFormData, { setSubmitting, setErrors }: any) => {
    setIsLoading(true);
    try {
      const res = await signUp(values);
      if (res.data.message === 'success') {
        navigate('/login');
      }
    } catch (error) {
      // @ts-ignore 
      if (error.response?.data?.message) {
        // @ts-ignore
        setErrors({ submit: error.response.data.message });
        setSubmitting(false);
        // @ts-ignore
      } else if (error.request) {
        setErrors({ submit: "Network error occurred" });
         setSubmitting(false);
      } else {
        setErrors({ submit: 'An unexpected error occurred' });
         setSubmitting(false);
      }
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <SignUpContainer direction="column" justifyContent="space-between">
          <Card variant="outlined">
            <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
              Sign up
            </Typography>

            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl>
                      <FormLabel htmlFor="name">Full name</FormLabel>
                      <Field
                        as={TextField}
                        autoComplete="name"
                        name="name"
                        fullWidth
                        id="name"
                        placeholder="Jon Snow"
                        error={touched.name && errors.name}
                        helperText={touched.name && errors.name}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <Field
                        as={TextField}
                        fullWidth
                        id="email"
                        placeholder="your@email.com"
                        name="email"
                        autoComplete="email"
                        error={touched.email && errors.email}
                        helperText={touched.email && errors.email}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <Field
                        as={TextField}
                        fullWidth
                        name="password"
                        placeholder="••••••"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        error={touched.password && errors.password}
                        helperText={touched.password && errors.password}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                      <Field
                        as={TextField}
                        fullWidth
                        name="confirmPassword"
                        placeholder="••••••"
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                        error={touched.confirmPassword && errors.confirmPassword}
                        helperText={touched.confirmPassword && errors.confirmPassword}
                      />
                    </FormControl>
                  {/* @ts-ignore  */}
                    {errors.submit && (
                      <Box
                        sx={{
                          mt: 3,
                        }}
                      >
                        {/* @ts-ignore  */}
                        <FormHelperText error>{errors.submit}</FormHelperText>
                      </Box>
                    )}

                    <Button type="submit" fullWidth variant="contained" disabled={isSubmitting}>
                      Sign up
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>

            <Divider>
              <Typography sx={{ color: 'text.secondary' }}>or</Typography>
            </Divider>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button fullWidth variant="outlined" onClick={() => alert('Sign up with Google')} startIcon={<GoogleIcon />}>
                Sign up with Google
              </Button>
              <Typography sx={{ textAlign: 'center' }}>
                Already have an account?{' '}
                <Link href="#/signin" variant="body2" sx={{ alignSelf: 'center' }}>
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Card>
        </SignUpContainer>
      )}
    </AppTheme>
  );
}
