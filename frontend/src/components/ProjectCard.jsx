import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import { useNavigate } from "react-router-dom";

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  borderRadius : '20px',
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export default function ProjectCard({ url, title }) {
  return (
    <Card
      variant="outlined"
      sx={{
        width: "300px", // Set a fixed width for the card
        height: "400px", // Set a fixed height for the card
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image at the top, filling 70% of the card */}
      <CardMedia
        component="img"
        image={url}
        alt={title}
        sx={{ height: "70%", objectFit: "cover" }}
      />

      {/* Title at the bottom, filling the remaining 30% */}
      <CardContent
        sx={{
          height: "30%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          component="h1"
          variant="h6"
          sx={{
            fontSize: "1.6rem",
            fontWeight: "bold",
            textAlign: "left",
            width: "90%",
          }}
        >
          {title}
        </Typography>

      </CardContent>
    </Card>
  );
}