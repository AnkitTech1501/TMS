
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Authentication/Login';
import Register from './Authentication/Register';
import ManagementDashboard from './Modules/Dashboard/ManagementDashboard';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path = "/management_dashboard" element = {<ManagementDashboard />} />
        {/* <PrivateRoute path="/home" component={Home} /> */}
        {/* <Redirect from="/" to="/home" /> */}
      </Routes>
    </Router>
  );
}

export default App;
