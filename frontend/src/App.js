import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Secure from "./Secure";
import Home from "./Home";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/secure" element={<Secure />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;