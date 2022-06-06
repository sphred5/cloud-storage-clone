import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Profile from "./authentication/Profile";
import PrivateRoute from "./authentication/PrivateRoute";
import Signup from "./authentication/Signup";
import Login from "./authentication/Login";
import ForgotPassword from "./authentication/ForgotPassword";
import UpdateProfile from "./authentication/UpdateProfile";
import Dashboard from "./drive/Dashboard";

function App() {
  return (

        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Drive */}
              <Route exact path="/" element={
                <PrivateRoute>
                  <Dashboard/> 
                </PrivateRoute>
              }/>

              {/* Profile */}
              <Route path="/user" element={
                <PrivateRoute>
                  <Profile/> 
                </PrivateRoute>
              }/>
              <Route path="/update-profile" element={
                <PrivateRoute>
                  <UpdateProfile/> 
                </PrivateRoute>
              }/>

              {/* Authentication */}
              <Route path="/signup" element={<Signup />}/>
              <Route path="/login" element={<Login />}/>
              <Route path="/forgot-password" element={<ForgotPassword />}/>
            </Routes>
          </AuthProvider>
        </BrowserRouter>

  );
}

export default App;
