import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const SPage = () => {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const navigate = useNavigate();

  const handleCloseDialog = () => {
    setDialogOpen(false);
    // Redirect based on dialog message content
    if (dialogMessage.toLowerCase().includes('success') || dialogMessage.toLowerCase().includes('duplicate') ) {
      navigate('/login'); // Redirect to login if message indicates success
    } else {
      navigate('/signup'); // Redirect to signup for other cases
    }
  };


  useEffect(() => {
    const email = localStorage.getItem('signup_email');
    const password = localStorage.getItem('signup_pwd');
    const name = localStorage.getItem('signup_name');
    console.log("reading from localStorage", email, password, name);

    if (!email || !password || !name) {
      setDialogMessage('Email, password, and name are required!');
      setDialogOpen(true);
      setLoading(false);
      return;
    }


    // Check if the user already exists
    axios({
      method: "GET",
      url: `https://jd4i7vga437hv4bzrjm6rqanui0vzbir.lambda-url.us-east-1.on.aws/api/user/fe/${email}`,
    })
      .then(response => {
        console.log("pre", response.data, response.data.user, response.data.user.length)
        if (response.data?.user) {
          setDialogMessage('Duplicate user, please log in!');
          setDialogOpen(true);
          setLoading(false);
          return; // Stop further execution if a duplicate user is found
        }

      })
      .catch(error => {
        console.log("P2 start creating");

        axios({
          method: "POST",
          url: `https://jd4i7vga437hv4bzrjm6rqanui0vzbir.lambda-url.us-east-1.on.aws/api/user`,
          headers: {
            'Content-Type': 'application/json'  // Set the Content-Type header to application/json
          },
          data: {
            email: email,
            name: name,
            password: password,
            type: "Regis"
          }
        })
          .then(createResponse => {
            console.log("User created successfully!", createResponse.data);
            setDialogMessage('User created successfully! Redirecting to login...');
            setDialogOpen(true);
            setLoading(false);
          })
          .catch(createError => {
            console.error('Failed Creating', createError);
            setDialogMessage('Failed to create user. Please try again.');
            setDialogOpen(true);
            setLoading(false);
          });
      });
  }, [navigate]);


  if (loading) {
    return (
      <div>
        <h2>Logging in...</h2>
        <p>Please wait, Signing up...</p>
      </div>
    );
  }


  // Display user info if login is successful
  return (
    <div style={{ display: "flex",  justifyContent: "center",
      alignItems: "center", height: '100vh',
      textAlign: "center"}}>
      {userInfo && (
        <h1>Welcome, {userInfo.name}!</h1>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Signup Notification</DialogTitle>
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

export default SPage;
