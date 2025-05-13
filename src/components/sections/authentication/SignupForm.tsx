import { Button, Grid, IconButton, InputAdornment, TextField } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { useBreakpoints } from 'providers/useBreakpoints';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    contact: '',
    fingerprint: '',
    account_no: '',
  });

  const navigate = useNavigate(); // Initialize useNavigate
  const { up } = useBreakpoints();
  const upSM = up('sm');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClick = async () => {
    setFormData({ username: '', 
      email: '',
      password: '',
      contact: '',
      fingerprint: '', 
      account_no: '' }); 
    try {
      const response = await fetch('http://127.0.0.1:8000/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          account_no: formData.account_no, 
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      alert(data.message); 

      
      setFormData({
        username: '',
        email: '',
        password: '',
        contact: '',
        fingerprint: '',
        account_no: '',
      });
      setFormData({
        username: '',
        email: '',
        password: '',
        contact: '',
        fingerprint: '',
        account_no: '',
      });
      navigate('/authentication/login'); // Navigate after successful registration
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const generateAccountNumber = () => {
    const randomNum = Math.floor(Math.random() * 1000000000); // Random number up to 1 billion
    setFormData((prevData) => ({
      ...prevData,
      account_no: 'BAN' + randomNum.toString(), // Update account_no in formData
    }));
  };
  return (
    <>
      <Grid container spacing={3} sx={{ mb: 2.5 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="username"
            label="UserName"
            value={formData.username}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size={upSM ? 'medium' : 'small'}
            name="email"
            label="Email address"
            value={formData.email}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size={upSM ? 'medium' : 'small'}
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <IconifyIcon icon={showPassword ? 'majesticons:eye' : 'majesticons:eye-off'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size={upSM ? 'medium' : 'small'}
            name="contact"
            label="Contact"
            value={formData.contact}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      <Button
        fullWidth
        size={upSM ? 'large' : 'medium'}
        variant="contained"
        color="primary"
        onClick={() => {
          generateAccountNumber(); // Generate account number on button click
          handleClick(); // Call handleClick to log form data
        }}
      >
        Sign Up
      </Button>
    </>
  );
};

export default SignupForm;
