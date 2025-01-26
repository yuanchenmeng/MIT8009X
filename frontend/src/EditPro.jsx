import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField, Button, Grid, Typography, Container, Box,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from "@mui/material";
import MyHeader from "./components/ProjectHeader";

const EditDataProjectForm = () => {
  const { pid } = useParams(); // Get the project ID from the URL
  const navigate = useNavigate(); // For navigation

  const [dialogOpen, setDialogOpen] = useState(false); // Control dialog visibility
  const [dialogMessage, setDialogMessage] = useState(""); // Store success or failure message

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
    const storedUserId = parseInt(localStorage.getItem("user_id"));
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
      cid: formData.cid ? parseInt(formData.cid, 10) : 2, // Set default value for cid if empty
      resources: JSON.parse(formData.resources || "[]"), // Parse resources as JSON
    };

    console.log("Updated Form Data Submitted:", submissionData);
    axios({
      method: "PUT",
      url: `https://jd4i7vga437hv4bzrjm6rqanui0vzbir.lambda-url.us-east-1.on.aws/api/projects/${pid}`, // URL includes the project id (pid)
      data: {
        keywords: submissionData.keywords,
        text: submissionData.text,
        tags: submissionData.tags,
        cid: submissionData.cid,
        uid: submissionData.uid,
        resources: submissionData.resources,
      }
    })
      .then((response) => {
        console.log(response.data);
        setDialogMessage("Project updated successfully!");
        setDialogOpen(true);
      })
      .catch((error) => {
        console.error("Error updating project:", error);
        setDialogMessage("Failed to update the project. Please try again.");
        setDialogOpen(true);
      });
  };

  const handleDelete = async () => {
    console.log("Delete clicked")
    try {
      await axios.delete(
        `https://jd4i7vga437hv4bzrjm6rqanui0vzbir.lambda-url.us-east-1.on.aws/api/projects/${pid}`
      );
      console.log(`Project ${pid} deleted successfully`);
      setDialogMessage(`Project ${pid} deleted successfully.`);
      setDialogOpen(true); // Open dialog with success message
    } catch (error) {
      console.error(`Error deleting project ${pid}:`, error);
      setDialogMessage(`Failed to delete project ${pid}. Please try again.`);
      setDialogOpen(true); // Open dialog with failure message
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    if (dialogMessage.includes("successfully")) {
      navigate("/central"); // Redirect to /central on successful deletion
    }
  };

  if (loading) {
    return (
      <Typography variant="h6" align="center">
        Loading project details...
      </Typography>
    );
  }

  return (
    <div>
      <MyHeader></MyHeader>
      <Container style={{ marginBottom: "30px", marginTop: "30px" }} maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          Edit The Project
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
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
                label="Cover Image Id"
                name="cid"
                type="number"
                value={formData.cid}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Resources"
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

                <Dialog
                  open={dialogOpen}
                  onClose={handleClose}
                >
                  <DialogTitle>
                    {dialogMessage.includes("successfully")
                      ? "Operation Successful"
                      : "Operation Failed"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>{dialogMessage}</DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                      OK
                    </Button>
                  </DialogActions>
                </Dialog>

              </Box>
            </Grid>
          </Grid>
        </form>
      </Container>
    </div>
  );
};

export default EditDataProjectForm;
