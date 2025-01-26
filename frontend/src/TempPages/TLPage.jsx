import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField} from '@mui/material';

const LoginPage = () => {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const navigate = useNavigate();
  const handleCloseDialog = () => {
    setDialogOpen(false);
    if (error) {
      navigate('/login');
    }
  };

  useEffect(() => {
    //const params = new URLSearchParams(window.location.search);
    //const email = params.get('email');
    //const password = params.get('password');
    const email = localStorage.getItem('login_email');
    const password = localStorage.getItem('login_pwd');
    //console.log("reading from url", email, password);

    if (!email || !password) {
      setDialogMessage('Email and password are required!');
      setDialogOpen(true); // Open dialog
      setLoading(false);
      return;
    }


    // Start login process (verify login credentials)
    axios.get(`https://jd4i7vga437hv4bzrjm6rqanui0vzbir.lambda-url.us-east-1.on.aws/api/user/fe/${email}`)
      .then(response => {
        const userData = response.data['user'];
        console.log(userData)

        // If the password matches the fetched user info, show the info
        if (userData && userData.password === password) {
          setUserInfo(userData);
          setLoading(false);
          localStorage.setItem('user_id', response.data['user']['uid']);
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          setError(true);
          setDialogMessage('Invalid email or password. Please try again.');
          setDialogOpen(true);
          setLoading(false);
        }
      })
      .catch(err => {
        setError(true);
        setDialogMessage('An error occurred while logging in. Please try again.');
        setDialogOpen(true);
        setLoading(false);
      });
  }, [navigate]);


  if (loading) {
    return (
      <div>
        <h2>Logging in...</h2>
        <p>Please wait, fetching user data...</p>
      </div>
    );
  }

  // Display user info if login is successful
  return (
    <div style={{
      display: "flex", justifyContent: "center",
      alignItems: "center", height: '100vh',
      textAlign: "center"
    }}>
      {userInfo && (
        <h1>Welcome, {userInfo.name}!</h1>
      )}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Login Error</DialogTitle>
        <DialogContent>
          <p>{dialogMessage}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default LoginPage;
