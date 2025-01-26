import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Fab } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Chip, Box, Typography, List, ListItem } from "@mui/material";
import axios from "axios";

export default function ProjectDetail() {
  const { pid } = useParams(); // Capture the dynamic :pid from the URL
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [resourceImageUrls, setResourceImageUrls] = useState([]);

  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/project/edit/${pid}`);
  };

  const colorArray = [
    "#eaa080", "#f4aa73", "#f7cb6d", "#92e892", "#85c7ec", "#cfa2ea", "#f09bc0","#ffb7ab"
  ];

  // Helper function to get a random color from the array
  const getRandomColor = () => {
    return colorArray[Math.floor(Math.random() * colorArray.length)];
  };

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


  // Fetch project details when the component mounts
  useEffect(() => {
    const fetchProject = async () => {
      try {
        // Simulating an API call to fetch project details by ID
        const response = await fetch(`https://jd4i7vga437hv4bzrjm6rqanui0vzbir.lambda-url.us-east-1.on.aws/api/projects/${pid}`);
        const data = await response.json();
        setProject(data["project"]);
        console.log("Project data", data["project"]);

        const projectData = data["project"]
        // Fetch cover image URL
        const coverUrl = await findUrls(projectData.cid);
        setCoverImageUrl(coverUrl);

        // Fetch image URLs for resources
        if (Array.isArray(projectData.resources)) {
          const resourceUrls = await Promise.all(
            projectData.resources.map((id) => findUrls(id))
          );
          setResourceImageUrls(resourceUrls);
        }

      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [pid]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <Typography variant="h6">Error: Project not found.</Typography>;
  }

  return (
    <div>
      <div style={{ padding: "20px" , width: "60%", margin: "auto"}}>
        <Typography variant="h4" gutterBottom>
          Project Title: {project.keywords}
        </Typography>
        <div style = {{marginBottom: "35px"}}></div>
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt="Cover"
            style={{ width: "80%", maxHeight: "300px", objectFit: "cover", borderRadius: "8px",
              marginTop: "10px",marginBottom: "10px", margin: "auto", display: "block"}}
          />
        ) : (
          <Typography  variant="body2" color="textSecondary">
            Cover image not available.
          </Typography>
        )}
        <div style = {{marginTop: "35px"}}></div>
        <Typography variant="h5" paragraph>
          <strong>Team Members:</strong>
        </Typography>
        <Typography variant="body1" paragraph>
          <p>{project.text}</p>
        </Typography>
        <Typography variant="h5" paragraph>
          <strong style={{marginTop: "10px", marginBottom: "10px"}}>Tags:</strong>
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap" marginBottom={2}>
          {project.tags.split(",").map((tag, index) => (
            <Chip
              key={index}
              label={tag.trim()}
              style={{
                backgroundColor: getRandomColor(),
                color: "white",
                fontWeight: "bold",
              }}
            />
          ))}
        </Box>
        <Typography variant="h5" paragraph>
          <strong>Resources:</strong>
        </Typography>
        <List>
          {resourceImageUrls.length > 0 ? (
            resourceImageUrls.map((url, index) => (
              <ListItem
                key={index}
                style={{
                  display: "flex", // Use flexbox
                  flexDirection: "column", // Stack items vertically
                  alignItems: "center", // Center-align items horizontally
                  paddingLeft: "0px",
                }}
              >
                <div>
                  <Typography variant="body1" paragraph>
                    <strong>Section {index} </strong>
                  </Typography>
                  <img
                    src={url}
                    alt={`Resource ${index + 1}`}
                    style={{ width: "100%", maxHeight: "300px", objectFit: "contain", marginBottom: "8px" }}
                  />

                </div>
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No resources available.
            </Typography>
          )}
        </List>
      </div>
      <div style={{
        position: "fixed",
        bottom: "50px",
        right: "50px",
        textAlign: "right"
      }}>
        <Fab color="primary" aria-label="edit" size = "large" onClick={handleEditClick}>
          <EditIcon />
        </Fab>
      </div>
    </div>

  );
}
