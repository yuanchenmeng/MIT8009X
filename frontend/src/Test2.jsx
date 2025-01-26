import React, {useState, useEffect} from 'react';
import './App.css';
import axios from 'axios';

function Test() {

  // UseEffect to fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({
          method: "POST",
          url: "https://jd4i7vga437hv4bzrjm6rqanui0vzbir.lambda-url.us-east-1.on.aws/api/cover",
          data: {
            url: "g"
          }
        });
        console.log(response.data)
      } catch (error) {
        console.error(error)
      }
    };
    fetchData(); // Call the fetch function when the component mounts
  }, []); // Empty dependency array ensures this runs only once when the component mounts


  return (
    <div className="App">


    </div>
  );
}

export default Test;
