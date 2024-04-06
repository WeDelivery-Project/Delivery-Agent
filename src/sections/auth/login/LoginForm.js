import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { loginRequest } from '../../../api/livreur';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState({ email: '', password: '' });

  const handleClick = async () => {
    try {
      const res = await loginRequest(login);
      if (res.status === 200) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('livreur', JSON.stringify(res.data.livreur));
        navigate('/dashboard', { replace: true });
      } else throw new Error('erreur connexion');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField
          value={login.email}
          onChange={(e) => {
            setLogin({ ...login, email: e.target.value });
          }}
          required
          name="email"
          label="Email address"
        />

        <TextField
          name="password"
          label="Password"
          onChange={(e) => {
            setLogin({ ...login, password: e.target.value });
          }}
          value={login.password}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
