import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GLogin from "./TempPages/GLogin";
import Secure from "./Secure";
import Home from "./Home";
import Test from "./Test";
import Signup from "./Signup";
import Login from "./Login";
import Gallery from "./Gallary";
import ProjectDetail from "./ProjectDetail";
import Manage from "./Manage";
import ProCre from "./ProjectNew";
import EditPro from "./ProjectEdit";
import TL from "./TempPages/TLPage";
import TS from "./TempPages/TSPage";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Test/>} />
          <Route path="/gin" element={<GLogin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/show" element={<Gallery />} />
          <Route path="/project/:pid" element={<ProjectDetail />} />
          <Route path="/project/edit/:pid" element={<EditPro />} />
          <Route path="/central" element={<Manage />} />
          <Route path="/project/new" element={<ProCre />} />
          <Route path="/secure" element={<Secure />} />
          <Route path="/tlp" element={<TL />} />
          <Route path="/tsn" element={<TS />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;