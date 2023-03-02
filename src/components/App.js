import React from "react";
import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import the page generating function from the respective .js files
import UpdateProfile from "./UpdateProfile";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import ViewAllPerformances from "./ViewAllPerformances";
import ViewAllScripts from "./ViewAllScripts";


function App() {
  return (
    <AuthProvider>
      <Container className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}>
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Router>
            <AuthProvider>
              {/* Add routes to different pages here using desired path name and .js component name */}
              <Routes>
                {/* TODO: PROTECT ROUTES WHEN USER !AUTHENTICATED */}
                <Route exact path="/" element={<Dashboard />} />
                <Route path="/update-profile" element={<UpdateProfile />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/view-all-performances" element={<ViewAllPerformances />} />
                <Route path="/view-all-scripts" element={<ViewAllScripts />} />
              </Routes>
            </AuthProvider>
          </Router>
        </div>
      </Container>
    </AuthProvider>


  );
}

export default App;
