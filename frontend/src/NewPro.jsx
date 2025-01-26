import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Container,
} from "@mui/material";

const CreateDataProjectForm = () => {
  const [formData, setFormData] = useState({
    keywords: "",
    text: "",
    tags: "",
    cid: "",
    resources: "",
  });

  const [userId, setUserId] = useState(null);

  // Fetch user ID from localStorage when the component loads
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    setUserId(storedUserId || ""); // Default to an empty string if not found
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Combine user ID into the submission data
    const submissionData = {
      ...formData,
      uid: userId,
    };

    console.log("Form Data Submitted: ", submissionData);
    // Add submission logic (e.g., API call)
  };

  return (
    <Container style = {{marginBottom: "30px", marginTop: "30px"}} maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Create New Data Project
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
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default CreateDataProjectForm;
