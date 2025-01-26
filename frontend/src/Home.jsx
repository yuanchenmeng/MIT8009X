import React, {useState} from "react";
import {
  Button, Box, Grid, TextField, Typography,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@mui/material";
import MyHeader from "./components/ProjectHeader";

function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleLogout = () => {
    // Clear the 'user_id' from localStorage
    localStorage.removeItem("user_id");
    localStorage.removeItem("login_email");
    localStorage.removeItem("login_pwd");
    localStorage.removeItem("signup_email");
    localStorage.removeItem("signup_pwd");
    localStorage.removeItem("signup_name");
    console.log("User logged out");
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };


  return (
    <div>
      <MyHeader></MyHeader>
      <main>

        <div style={{padding: "20px", width: "60%", margin: "0 auto", marginTop: "50px", marginBottom: "30px"}}>
          <Typography variant="h3" gutterBottom>
            MIT 2.009X
          </Typography>
          <Typography variant="h4" gutterBottom>
            Product Engineering Process
          </Typography>

        </div>

        <div style={{backgroundColor: "rgb(32, 6, 116)"}}>
          <div style={{padding: "5px", width: "60%", margin: "0 auto"}}>
            <Typography style={{marginTop: "20px", color: "rgb(255, 255, 255)"}} variant="body1" gutterBottom>
              The Product Engineering Processes course covers the engineering process of product design from conception
              to pre-production. The course teaches the creative design process through lectures and the creation,
              engineering, evaluation and prototype of a novel product.
            </Typography>
            <Typography style={{marginTop: "20px", color: "rgb(255, 255, 255)"}} variant="body1" gutterBottom>
              Students learn to identify and evaluate a problem and sketch, model, create, develop, test, and select
              best prototyping strategies for their product. They use project, risk management, engineering, and
              analysis skills to deliver a robust working product on time and on budget.
            </Typography>
            <Typography style={{marginTop: "20px", color: "rgb(255, 255, 255)"}} variant="body1" gutterBottom>
              Promote enterprise-involved, project-based learning in engineering education.
              Bridge the gap between academia and industry.
            </Typography>


          </div>

        </div>
        <Box
          sx={{
            width: "60%", // Adjust width to better fit content
            margin: "0 auto", // Center the container horizontally
            marginTop: "3%",
            marginBottom: "3%",
            padding: "10px",
          }}
        >
          <Grid container spacing={2} justifyContent="center">

            <Grid item xs={12} sm={6} md={3}>
              <a href="/show" style={{textDecoration: "none"}}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: "rgb(183, 46, 25)",
                    textTransform: "none",
                    "&:hover": {backgroundColor: "rgb(150, 30, 20)"},
                  }}
                >
                  Project Gallery
                </Button>
              </a>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <a href="/login" style={{textDecoration: "none"}}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: "rgb(183, 46, 25)",
                    textTransform: "none",
                    "&:hover": {backgroundColor: "rgb(150, 30, 20)"},
                  }}
                >
                  Login
                </Button>
              </a>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <a href="/signup" style={{textDecoration: "none"}}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: "rgb(183, 46, 25)",
                    textTransform: "none",
                    "&:hover": {backgroundColor: "rgb(150, 30, 20)"},
                  }}
                >
                  Sign Up
                </Button>
              </a>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "rgb(183, 46, 25)",
                  textTransform: "none",
                  "&:hover": {backgroundColor: "rgb(150, 30, 20)"},
                }}
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </Grid>
          </Grid>
        </Box>
        <div style={{padding: "10px"}}>
          <img decoding="async" alt=""
               style={{
                 height: "100%",
                 width: "100%",
                 objectFit: "cover",
                 objectPosition: "50% 12%",
               }}
               src="https://2009.mit.edu/files/2024/08/featured_image.jpg"

               srcSet="https://2009.mit.edu/files/2024/08/featured_image.jpg 1920w, https://2009.mit.edu/files/2024/08/featured_image-300x200.jpg 300w, https://2009.mit.edu/files/2024/08/featured_image-1024x683.jpg 1024w, https://2009.mit.edu/files/2024/08/featured_image-768x512.jpg 768w, https://2009.mit.edu/files/2024/08/featured_image-1536x1024.jpg 1536w"
          ></img>
        </div>

        <Dialog
          open={dialogOpen}
          onClose={handleClose}
        >
          <DialogTitle>Logout Successful</DialogTitle>
          <DialogContent>
            <DialogContentText>You have been logged out successfully.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>

      </main>
    </div>
  );
}

export default Home;