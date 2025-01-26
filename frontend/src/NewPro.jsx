import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField, Button, Grid, Typography, Container, Box, RadioGroup,  FormControlLabel, Radio,
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
  const [customImage, setCustomImage] = useState(null);
  const [coverOption, setCoverOption] = useState("default");

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

  const handleCoverChange = (event) => {
    setCoverOption(event.target.value);
  };

  const handleCustomImageChange = (event) => {
    setCustomImage(event.target.files[0]); // Capture the first uploaded file
  };

  const validateResources = (resources) => {
    if (!resources){
      return true;
    }
    console.log(resources);
    try {
      const parsed = JSON.parse(resources); // Attempt to parse JSON
      console.log("JSON PASS");
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

    let coverId = 2;

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


    // Combine user ID into the submission data
    const submissionData = {
      ...formData,
      uid: userId,
      cid: coverId,
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
              <Typography variant="h6">Select Project Cover Option</Typography>
              <RadioGroup
                name="coverOption"
                value={coverOption}
                onChange={handleCoverChange}
              >
                <FormControlLabel
                  value="default"
                  control={<Radio />}
                  label="Use Default Cover"
                />
                <FormControlLabel
                  value="customized"
                  control={<Radio />}
                  label="Upload Customized Cover"
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
