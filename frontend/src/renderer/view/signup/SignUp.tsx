import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import { GoogleIcon } from './CustomIcons';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { useNavigate } from 'react-router';
import { signUp } from '../../api/auth';
import ClipLoader from 'react-spinners/ClipLoader';
import { CircularProgress } from '@mui/material';

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

interface IFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

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

export default function SignUp(props: { disableCustomTheme?: boolean }) {
  const navigate = useNavigate();
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = React.useState('');

  const [formData, setFormData] = React.useState<IFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (validateInputs(formData)){

    
      try {
        const res = await signUp(formData);
        console.log('======= API RESPONSE =======', res);

        if (res.data.message === 'success') {
          navigate('/login');
        }
      } catch (error: any) {
        alert(error.message);
      }
    }
    setIsLoading(false);
  };

  const validateInputs = (formData: IFormData) => {
    const email = formData.email;
    const password = formData.password;
    const name = formData.name;
    const confirmPassword = formData.confirmPassword;

    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password || password.length < 1) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!name || name.length < 1) {
      setNameError(true);
      setNameErrorMessage('Name is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    if (!confirmPassword || confirmPassword !== password) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage('Confirm Password should be same as password');
      isValid = false;
    } else {
      setConfirmPasswordError(false);
      setConfirmPasswordErrorMessage('');
    }

    return isValid;
  };


  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      {isLoading ? (
        <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",height:'100vh'}}>
          <CircularProgress />
        </Box>
      ) : (
        <SignUpContainer direction="column" justifyContent="space-between">
          <Card variant="outlined">
            {/* <SitemarkIcon /> */}
            <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
              Sign up
            </Typography>
            <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl>
                <FormLabel htmlFor="name">Full name</FormLabel>
                <TextField
                  autoComplete="name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  placeholder="Jon Snow"
                  error={nameError}
                  helperText={nameErrorMessage}
                  color={nameError ? 'error' : 'primary'}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  required
                  fullWidth
                  id="email"
                  placeholder="your@email.com"
                  name="email"
                  autoComplete="email"
                  variant="outlined"
                  error={emailError}
                  helperText={emailErrorMessage}
                  color={passwordError ? 'error' : 'primary'}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  required
                  fullWidth
                  name="password"
                  placeholder="••••••"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  variant="outlined"
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  color={passwordError ? 'error' : 'primary'}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  placeholder="••••••"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  variant="outlined"
                  error={confirmPasswordError}
                  helperText={confirmPasswordErrorMessage}
                  color={confirmPasswordError ? 'error' : 'primary'}
                  onChange={handleInputChange}
                />
              </FormControl>
              <Button type="submit" fullWidth variant="contained" onClick={handleRegister}>
                Sign up
              </Button>
            </Box>
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
