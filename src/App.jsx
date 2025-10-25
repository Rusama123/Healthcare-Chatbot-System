import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Admin/login";
import Register from "./Admin/register";
import Dashboard from "./Admin/pages/Dashboard";
import Inventory from "./Admin/pages/inventory";
import Alert from "./Admin/pages/alerts";
import Suppliers from "./Admin/pages/suppliers";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />
        <Route path="/admin/pages/dashboard" element={<Dashboard />} />
        <Route path="/admin/pages/inventory" element={<Inventory />} />
        <Route path="/admin/pages/alerts" element={<Alert />} />
        <Route path="/admin/pages/suppliers" element={<Suppliers />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
  
};

export default App;