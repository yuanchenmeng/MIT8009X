import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import MyHeader from "./components/ProjectHeader";
import { TextField, Autocomplete, CircularProgress,Grid, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

function Gallery() {
  // State to store fetched data
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectUrls, setProjectUrls] = useState({});
  const navigate = useNavigate();

  const handleImageClick = (index) => {
    const pid = filteredData[index].pid
    navigate(`/project/${pid}`);
  }


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



  // UseEffect to fetch data when the component mounts
  useEffect(() => {
    // Define a function to fetch data
    const fetchData = async () => {
      try {
        // Make a GET request to the API
        const response = await axios({
          method: "GET",
          url: "https://jd4i7vga437hv4bzrjm6rqanui0vzbir.lambda-url.us-east-1.on.aws/api/projects",
        });
        console.log(response.data)
        const projects = response.data["projects"];
        setData(projects);
        setFilteredData(projects);

        // Extract unique tags from projects
        const uniqueTags = Array.from(
          new Set(
            projects.flatMap((project) =>
              project.tags
                .split(",")
                .map((tag) => tag.trim()) // Trim and normalize tags
            )
          )
        );
        setTags(uniqueTags);
        console.log(uniqueTags)

        setLoading(false);
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData(); // Call the fetch function when the component mounts
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  useEffect(() => {
    const fetchUrls = async () => {
      const urls = {};
      for (const project of filteredData) {
        if (project.cid) {
          const url = await findUrls(project.cid);
          urls[project.cid] = url; // Map CID to its URL
        }
      }
      setProjectUrls(urls); // Update state with all URLs
    };

    if (filteredData) {
      fetchUrls();
    }
  }, [filteredData]);


  // Filter logic
  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();

    const filtered = data.filter((project) => {
      // Match search term in text or tags
      const matchesSearch =
        lowercasedSearchTerm === "" ||
        project.keywords.toLowerCase().includes(lowercasedSearchTerm) ||
        project.text.toLowerCase().includes(lowercasedSearchTerm) ||
        project.tags.toLowerCase().includes(lowercasedSearchTerm);

      // Match selected tags
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => project.tags.includes(tag));

      return matchesSearch && matchesTags;
    });

    setFilteredData(filtered);
    console.log("FILTER, ", filtered)
  }, [searchTerm, selectedTags, data]);


  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div>
      <MyHeader></MyHeader>
      <div style={{ height: "100%", width: "85%",  margin: "auto "}}>
        <div style={{width: "70%", marginTop: "50px", marginBottom: "20px", display: "flex", gap: "35px", }}>


          <TextField
            label="Search Projects"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Autocomplete
            multiple
            options={tags}
            getOptionLabel={(option) => option}
            value={selectedTags}
            onChange={(e, newValue) => setSelectedTags(newValue)}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Filter by Tags" />
            )}
            fullWidth
          />
        </div>
        <div className="gallery-container1">2025</div>
        <div className="gallery-container2">All Projects</div>
        <Grid
          container
          spacing={3}
          sx={{
            padding: "20px",
          }}
        >
          {filteredData ? (
            filteredData.map((project, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: 3,
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                  }}
                  onClick={() => handleImageClick(index)}
                >
                  <CardMedia
                    component="img"
                    src={projectUrls[project.cid]}
                    alt={`Cover for project ${index + 1}`}
                    sx={{
                      width: "100%",
                      height: "200px", // Fixed height for all images
                      objectFit: "fill", // Distort to fill the space
                      borderTopLeftRadius: "8px",
                      borderTopRightRadius: "8px",
                    }}
                    loading="lazy"
                  />
                  <CardContent sx={{ padding: "10px" }}>
                    <Typography variant="h6">{`Project ${index + 1}`}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Project Title:</strong> {project.keywords}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="h6" color="textSecondary">
              No data available
            </Typography>
          )}
        </Grid>

      </div>
    </div>
  );
}

export default Gallery;
