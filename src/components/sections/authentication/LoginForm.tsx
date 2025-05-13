import { Button, Grid, IconButton, InputAdornment, TextField } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { useBreakpoints } from 'providers/useBreakpoints';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
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
    setFormData({ email: '', password: '' }); // Reset fields immediately on button click
    try {
      const response = await fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send email and password
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Network response was not ok');
      }
  
      const data = await response.json();
      alert(data.message);
  
      if (response.status === 200) {
        const geoData = await getGeolocation();
        const deviceInfo = getDeviceInfo();
        const currentTime = new Date().toISOString();
  
        console.log('Geolocation:', geoData);
        console.log('Device Info:', deviceInfo);
        console.log('Login Time:', currentTime);
  
        localStorage.setItem('user_info', JSON.stringify(data.user_info));
  
        const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
  
        if (userInfo?.id) {  // ✅ Check if userId exists before calling logUserActivity
          await logUserActivity(userInfo.id, geoData, deviceInfo);
        } else {
          console.error("User ID is missing from localStorage");
        }
  
        navigate('/transactions');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const logUserActivity = async (userId: string, geoData: any, deviceInfo: any) => {
    const currentTime = new Date().toISOString(); // Converts to ISO 8601 format

    const requestBody = {
        userId,
        geoData: JSON.stringify(geoData),  // Convert object to string
        deviceInfo: JSON.stringify(deviceInfo), // Convert object to string
        currentTime,
    };

    console.log('Request Payload:', JSON.stringify(requestBody, null, 2)); // Pretty print the JSON

    try {
        const response = await fetch('http://127.0.0.1:8000/log_user_activity/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to log user activity');
        }
        console.log('User activity logged successfully');
    } catch (error) {
        console.error('Error logging user activity:', error);
    }
};

  // Function to get geolocation (latitude and longitude)
  const getGeolocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(error.message);
          }
        );
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  };

  // Function to get device information (browser, OS, etc.)
  const getDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    return {
      userAgent,
      platform,
    };
  };



  return (
    <>
      <Grid container spacing={3} sx={{ mb: 2.5 }}>
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
      </Grid>

      <Button
        fullWidth
        size={upSM ? 'large' : 'medium'}
        type="button"
        variant="contained"
        color="primary"
        onClick={handleClick}
      >
        Login
      </Button>
    </>
  );
};

export default LoginForm;
