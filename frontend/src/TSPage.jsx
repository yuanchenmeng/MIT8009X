import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SPage = () => {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('signup_email');
    const password = localStorage.getItem('signup_pwd');
    const name = localStorage.getItem('signup_name');
    console.log("reading from localStorage", email, password, name);

    // Check if the user already exists
    axios({
      method: "GET",
      url: `https://jd4i7vga437hv4bzrjm6rqanui0vzbir.lambda-url.us-east-1.on.aws/api/user/fe/${email}`,
    })
      .then(response => {
        console.log("pre", response.data, response.data.user, response.data.user.length)
        if (response.data?.user) {
          console.log("User already exists!");
          alert("User already exists!")
          navigate('/login')
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
            navigate("/login"); // Redirect to login after successful creation
          })
          .catch(createError => {
            console.error('Failed Creating', createError);
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

  if (error) {
    alert('Signup failed. Please try again.');
    navigate('/signup');  // Redirect to login page
    return (
      <div>
        <h2>Error occurred. Redirecting...</h2>
      </div>
    );
  }

  // Display user info if login is successful
  return (
    <div style={{ display: "flex",  justifyContent: "center",
      alignItems: "center", height: '100vh',
      textAlign: "center"}}>
      <h1>Welcome, {userInfo.name}!</h1>
    </div>
  );
};

export default SPage;
