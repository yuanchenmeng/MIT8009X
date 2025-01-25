import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProjectDetail() {
  const { pid } = useParams(); // Capture the dynamic :pid from the URL
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch project details when the component mounts
  useEffect(() => {
    const fetchProject = async () => {
      try {
        // Simulating an API call to fetch project details by ID
        const response = await fetch(`https://y3g1gd4u24.execute-api.us-east-1.amazonaws.com/api/projects/${pid}`);
        const data = await response.json();
        setProject(data["project"]);
        console.log("Project data", data["project"]);
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [pid]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found!</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{project.keywords}</h1>
      <p><strong>Uploader Id:</strong> {project.uid}</p>
      <p><strong>Team Members:</strong> {project.text}</p>
      <p><strong>Tags:</strong> {project.tags}</p>
      <p><strong>Resources:</strong> {JSON.stringify(project.resources)}</p>
    </div>
  );
}
