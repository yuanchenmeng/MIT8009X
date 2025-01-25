import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GLogin from "./GLogin";
import Secure from "./Secure";
import Home from "./Home";
import Test from "./components/ProjectCard";
import Signup from "./Signup";
import Login from "./Login";
import Gallery from "./Gallary";
import ProjectDetail from "./ProjectDetail";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Test
            url="https://j19mc.s3.us-east-1.amazonaws.com/dirs/c1.jpg"
            title="Project Title"
          />} />
          <Route path="/gin" element={<GLogin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/show" element={<Gallery />} />
          <Route path="/project/:pid" element={<ProjectDetail />} />
          <Route path="/secure" element={<Secure />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;