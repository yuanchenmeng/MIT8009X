import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

function Home() {
  return (

<div>

    <div style={{ padding: "20px", width : "60%", margin: "0 auto"}}>
      <Typography variant="h3" gutterBottom>
        MIT 2.009X 
      </Typography>
      <Typography variant="h4" gutterBottom>
      Product Engineering Process
      </Typography>



    </div>

    <div style={{ backgroundColor: "rgb(32, 6, 116)" }}>
        <div style={{ padding: "5px", width : "60%", margin: "0 auto" }}>
          <Typography style={{marginTop: "20px", color: "rgb(255, 255, 255)"}} variant="body1" gutterBottom>
            The Product Engineering Processes course covers the engineering process of product design from conception to pre-production. The course teaches the creative design process through lectures and the creation, engineering, evaluation and prototype of a novel product.
          </Typography>
          <Typography style={{marginTop: "20px", color: "rgb(255, 255, 255)"}} variant="body1" gutterBottom>
            Students learn to identify and evaluate a problem and sketch, model, create, develop, test, and select best prototyping strategies for their product. They use project, risk management, engineering, and analysis skills to deliver a robust working product on time and on budget.
          </Typography>
          <Typography style={{marginTop: "20px", color: "rgb(255, 255, 255)"}} variant="body1" gutterBottom>
             Promote enterprise-involved, project-based learning in engineering education.
             Bridge the gap between academia and industry.
          </Typography>


        </div>
      
    </div>
  <div>
    <div   style={{
      padding: "5px",
      width: "60%",
      margin: "0 auto",
      display: "flex",
      justifyContent: "space-between",
      marginTop: "3%",
      marginBottom: "3%"
    }} >
      <Button style={{background: "rgb(183, 46, 25)"}} variant="contained" sx={{ textTransform: "none" }} >
        Project Gallary</Button>
      <Button style={{background: "rgb(183, 46, 25)"}} variant="contained" sx={{ textTransform: "none" }}>
        Login</Button>
      <Button style={{background: "rgb(183, 46, 25)"}} variant="contained" sx={{ textTransform: "none" }}>
        Sign up</Button>
    </div>
  </div>
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

</div>

  );
}

export default Home;