import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Container,
  Box
} from "@mui/material";

const EditDataProjectForm = () => {
  const { pid } = useParams(); // Get the project ID from the URL
  const navigate = useNavigate(); // For navigation
  const [formData, setFormData] = useState({
    keywords: "",
    text: "",
    tags: "",
    cid: "",
    resources: "",
  });

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user ID from localStorage when the component loads
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    setUserId(storedUserId || ""); // Default to an empty string if not found
  }, []);

  // Fetch project details when the component mounts
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `https://jd4i7vga437hv4bzrjm6rqanui0vzbir.lambda-url.us-east-1.on.aws/api/projects/${pid}`
        );
        const projectData = response.data.project;

        // Populate the form with fetched data
        setFormData({
          keywords: projectData.keywords || "",
          text: projectData.text || "",
          tags: projectData.tags || "",
          cid: projectData.cid || "",
          resources: JSON.stringify(projectData.resources || []),
        });
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [pid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
      uid: userId,
    };

    console.log("Updated Form Data Submitted:", submissionData);
    // Add API call to submit the updated project data here // TODO HERE WE GO
  };

  const handleDelete = async () => {
    console.log("Delete clicked")
    //try {
    //  await axios.delete(
    //    `https://jd4i7vga437hv4bzrjm6rqanui0vzbir.lambda-url.us-east-1.on.aws/api/projects/${pid}`
    //  );
    //  console.log(`Project ${pid} deleted successfully`);
    //  navigate("/show"); // Redirect to the '/show' page after deletion
    //} catch (error) {
    //  console.error(`Error deleting project ${pid}:`, error);
    //}
  };


  if (loading) {
    return (
      <Typography variant="h6" align="center">
        Loading project details...
      </Typography>
    );
  }

  return (
    <Container style={{ marginBottom: "30px", marginTop: "30px" }} maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Edit Data Project
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Keywords"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Text"
              name="text"
              multiline
              rows={4}
              value={formData.text}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Category ID (cid)"
              name="cid"
              type="number"
              value={formData.cid}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Resources (JSON)"
              name="resources"
              multiline
              rows={4}
              value={formData.resources}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Update Project
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" flexDirection="column" gap={2}>
              <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
                fullWidth
              >
                Delete
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate("/central")}
                fullWidth
              >
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default EditDataProjectForm;
