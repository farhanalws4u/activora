import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
// import ForgotPassword from './ForgotPassword';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './CustomIcons';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { useNavigate } from 'react-router';
import { signIn } from '../../api/auth';
import { CircularProgress } from '@mui/material';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
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
  email: string;
  password: string;
}

interface ILoginState {
  formData: IFormData;
  isLoading: boolean;
}

export default function SignIn(props: { disableCustomTheme?: boolean }) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');

  const navigate = useNavigate();

  const [state, setState] = React.useState<ILoginState>({
    formData: {
      email: '',
      password: '',
    },
    isLoading: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      formData: {
        ...state.formData,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((prevState) => ({ ...prevState, isLoading: true }));

    if (validateInputs(state.formData)) {
      try {
        const res = await signIn(state.formData);
        console.log('======= API RESPONSE =======', res);

        if (res.data.message === 'success') {
          const token = res.data.token;
          localStorage.setItem('token', token);
          navigate('/');
        }
      } catch (error: any) {
        alert(error.message);
      }
    } else {
      setState((prevState) => ({ ...prevState, isLoading: false }));
      return;
    }

    setState((prevState) => ({ ...prevState, isLoading: false }));
  };

  const validateInputs = (formData: IFormData) => {
    const email = formData.email;
    const password = formData.password;

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

    return isValid;
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      {state.isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <SignInContainer direction="column" justifyContent="space-between">
          <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
          <Card variant="outlined">
            {/* <SitemarkIcon /> */}
            <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSignIn}
              noValidate
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: 2,
              }}
            >
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  error={emailError}
                  helperText={emailErrorMessage}
                  id="email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  color={emailError ? 'error' : 'primary'}
                  sx={{ ariaLabel: 'email' }}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  name="password"
                  placeholder="••••••"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  color={passwordError ? 'error' : 'primary'}
                  onChange={handleInputChange}
                />
              </FormControl>
              {/* <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" /> */}
              {/* <ForgotPassword open={open} handleClose={handleClose} /> */}
              <Button type="submit" fullWidth variant="contained" onClick={handleSignIn}>
                Sign in
              </Button>
              <Typography sx={{ textAlign: 'center' }}>
                Don&apos;t have an account?{' '}
                <span>
                  <Link href="#/signup" variant="body2" sx={{ alignSelf: 'center' }}>
                    Sign up
                  </Link>
                </span>
              </Typography>
            </Box>
          </Card>
        </SignInContainer>
      )}
    </AppTheme>
  );
}
