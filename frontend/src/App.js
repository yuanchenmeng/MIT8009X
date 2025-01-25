import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GLogin from "./GLogin";
import Secure from "./Secure";
import Home from "./Home";
import Test from "./Test";
import Signup from "./Signup";
import Login from "./Login";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Test />} />
          <Route path="/gin" element={<GLogin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/secure" element={<Secure />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;