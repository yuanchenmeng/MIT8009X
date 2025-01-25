import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import MyHeader from "./components/ProjectHeader";

function Gallery() {
  // State to store fetched data
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectUrls, setProjectUrls] = useState({});


  const findUrls = async (cid) => {
    try {
      const response = await axios({
        method: "GET",
        url: `https://jd4i7vga437hv4bzrjm6rqanui0vzbir.lambda-url.us-east-1.on.aws/api/cover/${cid}`,
      });
      //console.log("URL RES", response.data)
      return response.data["content"]["url"]
    } catch (error) {
      setError('Error fetching data');
    }
  };



  // UseEffect to fetch data when the component mounts
  useEffect(() => {
    // Define a function to fetch data
    const fetchData = async () => {
      try {
        // Make a GET request to the API
        const response = await axios({
          method: "GET",
          url: "https://jd4i7vga437hv4bzrjm6rqanui0vzbir.lambda-url.us-east-1.on.aws/api/projects",
        });
        console.log(response.data)
        setData(response.data["projects"]); // Set the response data to state
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData(); // Call the fetch function when the component mounts
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  useEffect(() => {
    const fetchUrls = async () => {
      const urls = {};
      for (const project of data) {
        if (project.cid) {
          const url = await findUrls(project.cid);
          urls[project.cid] = url; // Map CID to its URL
        }
      }
      setProjectUrls(urls); // Update state with all URLs
    };

    if (data) {
      fetchUrls();
    }
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <MyHeader></MyHeader>
      <div style={{ height: "100%", width: "85%",  margin: "auto "}}>
        <div className="gallery-container1">2025</div>
        <div className="gallery-container2">Hello!</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", // Responsive grid
            gap: "20px", // Spacing between cards
            padding: "20px", // Add padding around the grid
          }}
        >
          {data ? (
            data.map((project, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "10px",

                  flexDirection: "column",
                  alignItems: "center", // Center content within the card
                  maxWidth: "400px", // Restrict the card width
                  margin: "20px auto", // Center the card horizontally
                  marginBottom: "20px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#fff",
                }}
              >
                <h3>Project {index + 1}</h3>
                <p><strong>Project Title:</strong> {project.keywords}</p>
                {/* Display the image if URL is available */}
                {projectUrls[project.cid] ? (
                  <div
                    style={{
                      width: "100%",
                      height: "200px", // Fixed height for all images
                      overflow: "hidden", // Hide overflow content
                      borderRadius: "8px", // Match card border radius
                    }}
                  >
                    <img
                      src={projectUrls[project.cid]}
                      alt={`Cover for project ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover", // Ensures uniform aspect ratio by cropping
                      }}
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <p>Loading cover image...</p>
                )}
              </div>
            ))
          ) : (
            <p>No data available</p>
          )}
        </div>



      </div>
    </div>
  );
}

export default Gallery;
