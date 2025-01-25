import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function Test() {
  // State to store fetched data
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);  // To handle loading state
  const [error, setError] = useState(null);      // To handle errors

  // UseEffect to fetch data when the component mounts
  useEffect(() => {
    // Define a function to fetch data
    const fetchData = async () => {
      try {
        // Make a GET request to the API
        const response = await axios({
          method: "GET", 
          url: "https://jd4i7vga437hv4bzrjm6rqanui0vzbir.lambda-url.us-east-1.on.aws/api/user/fe/a",
        });
        console.log(response.data)
        setData(response.data); // Set the response data to state
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData(); // Call the fetch function when the component mounts
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Data from API</h1>
        <p>{data ? JSON.stringify(data, null, 2) : 'No data available'}</p>
      </header>

    </div>
  );
}

export default Test;
