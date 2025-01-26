import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField, Button, Grid, Typography, Container, Box, RadioGroup,  FormControlLabel, Radio,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from "@mui/material";
import MyHeader from "./components/ProjectHeader";

const EditDataProjectForm = () => {
  const { pid } = useParams(); // Get the project ID from the URL
  const navigate = useNavigate(); // For navigation

  const [dialogOpen, setDialogOpen] = useState(false); // Control dialog visibility
  const [dialogMessage, setDialogMessage] = useState(""); // Store success or failure message
  const [customImage, setCustomImage] = useState(null);
  const [coverOption, setCoverOption] = useState("default");

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    keywords: "",
    text: "",
    tags: "",
    cid: "",
    resources: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleCoverChange = (event) => {
    setCoverOption(event.target.value);
  };

  const handleCustomImageChange = (event) => {
    setCustomImage(event.target.files[0]); // Capture the first uploaded file
  };


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

  const validateResources = (resources) => {
    if (!resources){
      return true;
    }
    console.log(resources);
    try {
      const parsed = JSON.parse(resources); // Attempt to parse JSON
      if (!Array.isArray(parsed)) {
        throw new Error("Resources must be a list."); // Must be an array
      }
      if (!parsed.every((item) => Number.isInteger(item))) {
        throw new Error("Resources must be a list of integers."); // Check if all elements are integers
      }
      return true; // Validation successful
    } catch (error) {
      return error.message; // Return error message for validation failure
    }
  };

  const validateCover = () => {
    if (coverOption === "customized") {
      if (!customImage) {
        setDialogMessage("Please upload an image for the customized cover.");
        setDialogOpen(true);
        return false; // Prevent form submission
      }

      // Check if the file size exceeds 5MB
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB in bytes
      if (customImage.size > maxSizeInBytes) {
        setDialogMessage("The uploaded image exceeds the maximum size of 5MB. Please upload a smaller file.");
        setDialogOpen(true);
        return false; // Prevent form submission
      }
    }

    return true; // Form is valid
  };

  const uploadImage = async (imageFile) => {
    console.log("uploading img");
    try {
      const formData = new FormData();
      formData.append("image", imageFile); // Add the image to the form data
      const response = await axios.post("https://jd4i7vga437hv4bzrjm6rqanui0vzbir.lambda-url.us-east-1.on.aws/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      //console.log(response.data);
      return response.data.fileUrl; // Assuming the API returns the media URL
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image.");
    }
  };

  const uploadCover = async (url) => {
    try {
      const response = await axios.post("https://jd4i7vga437hv4bzrjm6rqanui0vzbir.lambda-url.us-east-1.on.aws/api/cover", { url });
      return response.data.cid; // Assuming the API returns cover ID (cid)
    } catch (error) {
      console.error("Error uploading cover:", error);
      throw new Error("Failed to upload cover.");
    }
  };




  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationResult = validateResources(formData.resources);
    if (validationResult !== true) {
      setDialogMessage(validationResult); // Show validation error in the dialog
      setDialogOpen(true);
      return;
    }
    if (!validateCover()) {
      return;
    }
    let coverId = formData.cid;
    console.log("previous cid", coverId)

    if (coverOption === "customized" && customImage) {
      try {
        // Step 1: Upload the image and get the URL
        const imageUrl = await uploadImage(customImage);
        //console.log("image upload success", imageUrl)

        // Step 2: Upload the URL to '/cover' and get the cover ID (cid)
        coverId = await uploadCover(imageUrl);
        //console.log("media res upload success", coverId)
      } catch (error) {
        setDialogMessage("Error occurred while processing the cover. Please try again.");
        setDialogOpen(true);
        return;
      }
    }

    const submissionData = {
      ...formData,
      uid: userId,
      cid: coverId,
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
              <Typography variant="h6">Select Project Cover Option</Typography>
              <RadioGroup
                name="coverOption"
                value={coverOption}
                onChange={handleCoverChange}
              >
                <FormControlLabel
                  value="default"
                  control={<Radio />}
                  label="Use Current Cover"
                />
                <FormControlLabel
                  value="customized"
                  control={<Radio />}
                  label="Upload New Cover"
                />
              </RadioGroup>
            </Grid>

            {/* Conditionally show upload field if "customized" is selected */}
            {coverOption === "customized" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="file"
                  onChange={handleCustomImageChange}
                  inputProps={{
                    accept: "image/*", // Accept only image files
                  }}
                />
              </Grid>
            )}

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
