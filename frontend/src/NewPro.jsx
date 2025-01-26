import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField, Button, Grid, Typography, Container, Box,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from "@mui/material";
import axios from "axios";
import MyHeader from "./components/ProjectHeader";

const CreateDataProjectForm = () => {
  const [formData, setFormData] = useState({
    keywords: "",
    text: "",
    tags: "",
    cid: "",
    resources: "",
  });

  const [userId, setUserId] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false); // Control dialog visibility
  const [dialogMessage, setDialogMessage] = useState(""); // Store success or failure message

  const navigate = useNavigate(); // For navigation

  // Fetch user ID from localStorage when the component loads
  useEffect(() => {
    const storedUserId = parseInt(localStorage.getItem("user_id"));
    setUserId(storedUserId || ""); // Default to an empty string if not found
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClose = () => {
    setDialogOpen(false);
    if (dialogMessage.includes("successfully")) {
      navigate("/central"); // Redirect to /central on successful deletion
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Combine user ID into the submission data
    const submissionData = {
      ...formData,
      uid: userId,
      cid: formData.cid ? parseInt(formData.cid, 10) : 2, // Set default value for cid if empty
      resources: JSON.parse(formData.resources || "[]"), // Parse resources as JSON
    };

    console.log("Form Data Submitted: ", submissionData);

    // Make the axios call using .then() instead of async/await
    axios({
      method: "POST",
      url: "https://jd4i7vga437hv4bzrjm6rqanui0vzbir.lambda-url.us-east-1.on.aws/api/projects",
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
        setDialogMessage("Project create successfully!");
        setDialogOpen(true);
      })
      .catch((error) => {
        console.error(error);
        setDialogMessage("Failed to create the project. Please try again.");
        setDialogOpen(true);
      });
  };


  return (
    <div>
      <MyHeader></MyHeader>
      <Container style = {{marginBottom: "30px", marginTop: "30px"}} maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          Create A New Project
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
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
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
    </div>
  );
};

export default CreateDataProjectForm;
